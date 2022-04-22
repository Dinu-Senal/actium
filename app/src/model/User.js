import dayjs from 'dayjs'

export class User {
    constructor (publicKey, accountData) {
        this.publicKey = publicKey
        this.author = accountData.author
        this.timestamp = accountData.timestamp.toString()
        this.full_name = accountData.fullName
        this.designation = accountData.designation
        this.license_number = accountData.licenseNumber
        this.nic_number = accountData.nicNumber
        this.contact = accountData.contact
    }

    get key() {
        return this.publicKey.toBase58()
    }

    get key_sliced() {
        const publickey = this.publicKey.toBase58()
        return publickey.slice(0,4) + '..' + publickey.slice(-4)
    }

    get author_key() {
        return this.author.toBase58()
    }

    get author_display() {
        const author = this.author.toBase58()
        return author.slice(0,4) + '..' + author.slice(-4)
    }

    get created_at() {
        return dayjs.unix(this.timestamp).format('DD - MMMM - YYYY')
    }

    get created_ago() {
        var relativeTime = require('dayjs/plugin/relativeTime')
        dayjs.extend(relativeTime)
        return dayjs.unix(this.timestamp).fromNow()
    }
}