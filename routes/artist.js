
import Router from 'koa-router'
const router = new Router({ prefix: '/artist' })
import Products from '../modules/products.js'

const dbName = 'website.db'

async function checkAuth(ctx, next) {
	console.log('secure router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/artist')
	await next()
}

router.use(checkAuth)

router.get('/', async ctx => {
	const products = await new Products(dbName)
	try {
		ctx.hbs.accountid = ctx.session.accountid
		const product = await products.getArtistProducts(ctx.hbs.accountid)
		ctx.hbs.products = product
		console.log(product)
		await ctx.render('artist', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

router.get('/remove/:productid', async ctx => {
	const products = await new Products(dbName)
	try {
		const deleted = await products.deleteProduct(ctx.params.productid)
		ctx.hbs.products = deleted
		console.log(deleted)
		await ctx.render('artist', ctx.hbs)
		ctx.redirect('/artist?msg=Product has been deleted')
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

router.get('/edit/:productid', async ctx => {
	//console.log('product id')
	await ctx.render('edit', ctx.hbs)
})

router.post('/edit/:productid', async ctx => {
	const products = await new Products(dbName)
	try {
		const status = await products.updateStatus(ctx.request.body.status,ctx.params.productid)
		ctx.hbs.products = status
		await ctx.render('edit', ctx.hbs)
		ctx.redirect('/artist?msg=Product has been updated')
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

router.get('/addProduct', async ctx => {
	await ctx.render('addProduct', ctx.hbs)
})

router.post('/addProduct', async ctx => {
	const products = await new Products(dbName)
	try {
		ctx.hbs.accountid = ctx.session.accountid
		if(ctx.request.files.img.name) {
			ctx.request.body.filePath = ctx.request.files.img.path
			ctx.request.body.fileName = ctx.request.files.img.name
			ctx.request.body.fileType = ctx.request.files.img.type
		}
		const addItem = await products.addProduct(ctx.request.body,ctx.hbs.accountid)
		ctx.hbs.products = addItem
		await ctx.render('addProduct', ctx.hbs)
		ctx.redirect('/artist?msg=Product has been added')
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

export default router
