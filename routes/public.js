import Router from 'koa-router'
import bodyParser from 'koa-body'

const router = new Router()
router.use(bodyParser({multipart: true}))

import Accounts from '../modules/accounts.js'
import Products from '../modules/products.js'

const dbName = 'website.db'

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 */

router.get('/', async ctx => {
	const products = await new Products(dbName)
	const accounts = await new Accounts(dbName)
	try {
		const product = await products.getProducts()
		const accountid = await products.getid(product)
		const account = await accounts.getDetails(accountid)
		ctx.hbs.products = product
		ctx.hbs.accounts = account
		await ctx.render('index', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */


router.post('/register', async ctx => {
	const registrationInfo = {username: ctx.request.body.user,
		password: ctx.request.body.pass,
		eaddress: ctx.request.body.email,
		fname: ctx.request.body.firstname,
		lname: ctx.request.body.lastname,
		number: ctx.request.body.phone}
	const account = await new Accounts(dbName)
	try {
		// call the functions in the module
		await account.register(registrationInfo)
		ctx.redirect(`/login?msg=new user "${registrationInfo.username}" added, you need to log in`)
	} catch(err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('register', ctx.hbs)
	} finally {
		account.close()
	}
})

router.get('/login', async ctx => {
	console.log(ctx.hbs)
	await ctx.render('login', ctx.hbs)
})

router.post('/login', async ctx => {
	const account = await new Accounts(dbName)
	ctx.hbs.body = ctx.request.body
	try {
		const body = ctx.request.body
		const accountid = await account.login(body.user, body.pass)
		ctx.session.authorised = true
		ctx.session.accountid = accountid
		const referrer = body.referrer || '/secure'
		return ctx.redirect(`${referrer}?msg=you are now logged in...`)
	} catch(err) {
		ctx.hbs.msg = err.message
		await ctx.render('login', ctx.hbs)
	} finally {
		account.close()
	}
})

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	delete ctx.session.accountid
	ctx.redirect('/?msg=you are now logged out')
})

export default router
