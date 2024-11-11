
import test from 'ava'
import Accounts from '../modules/accounts.js'

test('REGISTER : register and log in with a valid account', async test => {
	//arrange
	test.plan(1)
	const account = await new Accounts() // no database specified so runs in-memory
	const registrationInfo = {
		username: 'doej',
		password: 'password',
		eaddress: 'doej@gmail.com',
		fname: 'john',
		lname: 'doe',
		number: '01234567891'
	}
	try {
		//act
		await account.register(registrationInfo)
	  await account.login('doej', 'password')
		//assert
		test.pass('successfully logged in')
	} catch(err) {
		test.is(err.message, 'unable to log in', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER : register a duplicate username', async test => {
	//arrange
	test.plan(1)
	const account = await new Accounts()
	const registrationInfo = {
		username: 'doej',
		password: 'password',
		eaddress: 'doej@gmail.com',
		fname: 'john',
		lname: 'doe',
		number: '01234567891'
	}
	try {
		//act
		await account.register(registrationInfo)
		await account.register(registrationInfo)
		//assert
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'username "doej" already in use', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER : error if blank username', async test => {
	//arrange
	test.plan(1)
	const account = await new Accounts()
	const registrationInfo = {
		username: '',
		password: 'password',
		eaddress: 'doej@gmail.com',
		fname: 'john',
		lname: 'doe',
		number: '01234567891'
	}
	try {
		//act
		await account.register(registrationInfo)
		//assert
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER : error if blank password', async test => {
	//arrange
	test.plan(1)
	const account = await new Accounts()
	const registrationInfo = {
		username: 'doej',
		password: '',
		eaddress: 'doej@gmail.com',
		fname: 'john',
		lname: 'doe',
		number: '01234567891'
	}
	try {
		//act
		await account.register(registrationInfo)
		//assert
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER : error if blank email', async test => {
	//arrange
	test.plan(1)
	const account = await new Accounts()
	const registrationInfo = {
		username: 'doej',
		password: 'password',
		eaddress: '',
		fname: 'john',
		lname: 'doe',
		number: '01234567891'
	}
	try {
		//act
		await account.register(registrationInfo)
		//assert
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER : error if blank first name', async test => {
	//arrange
	test.plan(1)
	const account = await new Accounts()
	const registrationInfo = {
		username: 'doej',
		password: 'password',
		eaddress: 'doej@gmail.com',
		fname: '',
		lname: 'doe',
		number: '01234567891'
	}
	try {
		//act
		await account.register(registrationInfo)
		//assert
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER : error if blank last name', async test => {
	//arrange
	test.plan(1)
	const account = await new Accounts()
	const registrationInfo = {
		username: 'doej',
		password: 'password',
		eaddress: 'doej@gmail.com',
		fname: 'john',
		lname: '',
		number: '01234567891'
	}
	try {
		//act
		await account.register(registrationInfo)
		//assert
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER : error if blank phone number', async test => {
	//arrange
	test.plan(1)
	//act
	const account = await new Accounts()
	const registrationInfo = {
		username: 'doej',
		password: 'password',
		eaddress: 'doej@gmail.com',
		fname: 'john',
		lname: 'doe',
		number: ''
	}
	try {
		await account.register(registrationInfo)
		//assert
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER : error if duplicate email', async test => {
	//arrange
	test.plan(1)
	const account = await new Accounts()
	const registrationInfo1 = {
		username: 'doej',
		password: 'password',
		eaddress: 'doej@gmail.com',
		fname: 'john',
		lname: 'doe',
		number: '01234567891'
	}
	const registrationInfo2 = {
		username: 'bloggsj',
		password: 'newpassword',
		eaddress: 'doej@gmail.com',
		fname: 'joe',
		lname: 'bloggs',
		number: '09876543211'
	}
	try {
		//act
		await account.register(registrationInfo1)
		await account.register(registrationInfo2)
		//assert
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'email address "doej@gmail.com" is already in use', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('LOGIN    : invalid username', async test => {
	//arrange
	test.plan(1)
	const account = await new Accounts()
	const registrationInfo = {
		username: 'doej',
		password: 'password',
		eaddress: 'doej@gmail.com',
		fname: 'john',
		lname: 'doe',
		number: '01234567891'
	}
	try {
		//act
		await account.register(registrationInfo)
		await account.login('roej', 'password')
		//assert
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'username "roej" not found', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('LOGIN    : invalid password', async test => {
	//arrange
	test.plan(1)
	const account = await new Accounts()
	const registrationInfo = {
		username: 'doej',
		password: 'password',
		eaddress: 'doej@gmail.com',
		fname: 'john',
		lname: 'doe',
		number: '01234567891'
	}
	try {
		//act
		await account.register(registrationInfo)
		await account.login('doej', 'bad')
		//assert
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'invalid password for account "doej"', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('GETDETAILS : error if unable to get user details', async test => {
	//arrange
	test.plan(1)
	const account = await new Accounts()
	const accountids = ['1','2','3','4','5']
	try {
		//act
		await account.getDetails(accountids)
		//assert
		test.pass()
	} catch(err) {
		test.is(err.message, 'unable to retrieve user details')
	} finally {
		account.close()
	}
})
