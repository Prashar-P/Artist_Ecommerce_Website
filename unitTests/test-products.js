import test from 'ava'
import Products from '../modules/products.js'

test('ADDPRODUCT : Add new product to database', async test => {
	// arrange
	test.plan(1)
	const product = await new Products()
	const productDetails = {
		name: 'sample',
		price: 1234,
		image: 'sample.jpg',
		status: 'for sale',
		description: 'This is a product description'
	}
	try {
		// act
		await product.addProduct(productDetails,1)
		// assert
		test.pass()
	} catch(err) {
		test.fail(err.message,'Unable to add new product')
	} finally {
		product.close()
	}
})

test('ADDPRODUCT : error if no name is provided', async test => {
	// arrange
	test.plan(1)
	const product = await new Products()
	const productDetails = {
		name: '',
		price: 1234,
		image: 'sample.jpg',
		status: 'for sale',
		description: 'This is a product description'
	}
	try {
		// act
		await product.addProduct(productDetails,1)
		// assert
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	}finally {
		product.close()
	}
})

test('ADDPRODUCT : error if no price is provided', async test => {
	// arrange
	test.plan(1)
	const product = await new Products()
	const productDetails = {
		name: 'sample',
		price: '',
		image: 'sample.jpg',
		status: 'for sale',
		description: 'This is a product description'
	}
	try {
		// act
		await product.addProduct(productDetails,1)
		// assert
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		product.close()
	}
})

test('ADDPRODUCT : error if no image is provided', async test => {
	// arrange
	test.plan(1)
	const product = await new Products()
	const productDetails = {
		name: 'sample',
		price: 1234,
		image: '',
		status: 'for sale',
		description: 'This is a product description'
	}
	try {
		// act
		await product.addProduct(productDetails,1)
		// assert
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		product.close()
	}
})

test('ADDPRODUCT : error if no status is provided', async test => {
	// arrange
	test.plan(1)
	const product = await new Products()
	const productDetails = {
		name: 'sample',
		price: 1234,
		image: 'sample.jpg',
		status: ''
	}
	try {
		// act
		await product.addProduct(productDetails,1)
		// assert
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		product.close()
	}
})

test('DELETEPRODUCT : error if product cannot be deleted', async test => {
	// arrange
	test.plan(1)
	const product = await new Products()
	try{
		// act
		await product.deleteProduct(1)
		// assert
		test.pass()
	}catch(err) {
		test.is(err.message, 'cannot delete product')
	} finally {
		product.close()
	}
})

test('UPDATESTATUS : error if product status cannot be updated', async test => {
	// arrange
	test.plan(1)
	const product = await new Products()
	try{
		// act
		await product.updateStatus('sold', 1)
		// assert
		test.pass()
	}catch(err) {
		test.is(err.message, 'cannot update product status')
	} finally {
		product.close()
	}
})
