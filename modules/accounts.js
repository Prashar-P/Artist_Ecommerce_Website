
/** @module Accounts */

import bcrypt from 'bcrypt-promise'
import sqlite from 'sqlite-async'

const saltRounds = 10

/**
 * Accounts
 * ES6 module that handles registering accounts and logging in.
 */

class Accounts {

	/**
   * Create an account object
   * @param {String} [dbName=":memory:"] - The name of the database file to use.
   */

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS users\
				(accountid INTEGER PRIMARY KEY AUTOINCREMENT,\
         user TEXT,\
         pass TEXT,\
         email TEXT,\
         firstname TEXT,\
         lastname TEXT,\
         phone TEXT);'
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * registers a new user
	 * @param {String} user the chosen username
	 * @param {String} pass the chosen password
	 * @param {String} email the chosen email
	 * @returns {Boolean} returns true if the new user has been added
	 */

	async register(registrationInfo) {
		Object.keys(registrationInfo).forEach(i => {
			if(registrationInfo[i].length === 0) throw new Error('missing field')
		})
		let sql = `SELECT COUNT(accountid) as records FROM users WHERE user="${registrationInfo.username}";`
		const data = await this.db.get(sql)
		if(data.records !== 0) throw new Error(`username "${registrationInfo.username}" already in use`)
		sql = `SELECT COUNT(accountid) as records FROM users WHERE email="${registrationInfo.eaddress}";`
		const emails = await this.db.get(sql)
		if(emails.records !== 0) throw new Error(`email address "${registrationInfo.eaddress}" is already in use`)
		registrationInfo.password = await bcrypt.hash(registrationInfo.password, saltRounds)
		sql = `INSERT INTO users(user, pass, email,firstname, lastname, phone) VALUES(\
           "${registrationInfo.username}", "${registrationInfo.password}", "${registrationInfo.eaddress}",\
           "${registrationInfo.fname}", "${registrationInfo.lname}", "${registrationInfo.number}")`
		await this.db.run(sql)
		return true
	}

	/**
	 * checks to see if a set of login credentials are valid
	 * @param {String} username the username to check
	 * @param {String} password the password to check
	 * @returns {Int} returns accountid if credentials are valid
	 */

	async login(username, password) {
		let sql = `SELECT count(accountid) AS count FROM users WHERE user="${username}";`
		const records = await this.db.get(sql)
		if(!records.count) throw new Error(`username "${username}" not found`)
		sql = `SELECT accountid, pass FROM users WHERE user = "${username}";`
		const record = await this.db.get(sql)
		const valid = await bcrypt.compare(password, record.pass)
		if(valid === false) throw new Error(`invalid password for account "${username}"`)
		return record.accountid
	}

	/**
	 * gets the users name and phone number
	 * @param {Int} accountid
	 * @returns {Array} returns array containing the users details
	 */

	async getDetails(accountids) {
		const userDetails = []
		for (const accountid of accountids) {
			const sql = `SELECT firstname,lastname,phone FROM users WHERE accountid="${accountid}";`
			const data = await this.db.all(sql)
			userDetails.push(data[0])
		}
		return userDetails
	}

	/* function to close database */

	async close() {
		await this.db.close()
	}
}

export default Accounts
