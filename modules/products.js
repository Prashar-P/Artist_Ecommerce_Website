/** @module Products */

import sqlite from 'sqlite-async'
import mime from 'mime-types'
import fs from 'fs-extra'

/** ES6 module that manages the products in the Gallery*/
class Products {

	/**
  * Create an product object
  * @param {String} [dbName=":memory:"] - The name of the database file to use.
  */

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS product_list(\
				productid	INTEGER PRIMARY KEY AUTOINCREMENT,\
				accountid	INTEGER,\
				name TEXT NOT NULL,\
				price INTEGER NOT NULL,\
				img TEXT NOT NULL,\
        status TEXT NOT NULL,\
        description TEXT,\
				date TEXT,\
				FOREIGN KEY(accountid) REFERENCES user_details(accountid)\
      );'
			await this.db.run(sql)
			return this
		})()
	}

 	/**
	 * gets all products in system
	 * @returns {Array} returns array of all products in the database
	 */

	async getProducts() {
		const sql = 'SELECT * FROM product_list ORDER BY date DESC;'
		const products = await this.db.all(sql)
		for(const i in products) {
			const date = new Date(products[i].date)
			const newdate = `${date.getDate()}`/`${date.getMonth()}`/`${date.getFullYear()}`
			products[i].date = newdate
		}
		return products
	}

	/**
	 * gets all products in system for a particular artist
	 * @param {Int}  id that matches the id of current user logged in
	 * @returns {Array} returns array of all products in the database
	 */

	async getArtistProducts(accountid) {
		const sql = `SELECT * FROM product_list WHERE accountid = "${accountid}" ORDER BY date DESC;`
		const products = await this.db.all(sql)
		return products
	}


	/**
	 * add new product
	 * @param {Object} Object containing the name, price, img, status, description of the product
	 * @param {Int} accountid of user logged in
	 * @returns {Boolean} returns true if product has been added
	 */

	async addProduct(productDetails,accountid) {
		let filename
		const ms = 1000, date = Math.floor(Date.now()/ms)
		Object.keys(productDetails).forEach(i => {
			if(productDetails[i].length === 0) throw new Error('missing field')
		})
		if(productDetails.fileName) {
			filename = `${Date.now()}.${mime.extension(productDetails.fileType)}`
 			await fs.copy(productDetails.filePath, `public/images/${filename}`)
 		}
		try{
			const sql = `INSERT INTO product_list(name, price, img, status,description,accountid,date)\
                   VALUES("${productDetails.name}","${productDetails.price}","${filename}"\
                   ,"${productDetails.status}","${productDetails.description}","${accountid}","${date}")`
			await this.db.all(sql)
			return true
		}catch(err) {
			throw err
		}
	}


	/**
	 * delete existing product
	 * @param {Int} id of product to be deleted
	 * @returns {Boolean} returns true if product has been deleted
	 */

	async deleteProduct(productid) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('Product does not exist.')
		})
		const sql = `DELETE FROM product_list WHERE productid="${productid}";`
		await this.db.run(sql)
		return true
	}

	/**
	 * update existing product status
	 * @param {String} new product status
	 * @param {Int} id of product which will have status changed
	 * @returns {Boolean} returns true if product status has been updated
	 */

	async updateStatus(status,productid) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('Product does not exist.')
		})
		const sql = `UPDATE product_list SET status="${status}" WHERE productid="${productid}";`
		await this.db.run(sql)
		return true
	}

	/**
	 * retrieves accountid of a product
   * @param {Array} array of all products in the database
	 * @returns {Array} returns array of accountids for all products
	 */

	async getid(product) {
		const accountids = []
		for(const item in product) {
			const id = `${product[item].accountid}`
			accountids.push(id)
		}
		return accountids
	}

	/* function to close database */
 	async close() {
		await this.db.close()
	}

}

export default Products
