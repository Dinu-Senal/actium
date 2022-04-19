import dayjs from 'dayjs';

export class Service {
    constructor (publicKey, accountData) {
        this.publicKey = publicKey
        this.author = accountData.author
        this.timestamp = accountData.timestamp.toString()
        this.part_description = accountData.partDescription
        this.date_purchased = accountData.datePurchased
        this.warranty_code = accountData.warrantyCode
        this.vessel_part_public_key_fkey = accountData.vesselPartPublicKeyFkey
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
    
    get sliced_key() {
        const key = this.publicKey.toBase58()
        return key.slice(0,4) + '..' + key.slice(-4)
    }

    get author_display() {
        const author = this.author.toBase58()
        return author.slice(0,4) + '..' + author.slice(-4)
    }

    get created_at() {
        return dayjs.unix(this.timestamp).format('DD/MM/YYYY')
    }

    get created_ago() {
        var relativeTime = require('dayjs/plugin/relativeTime')
        dayjs.extend(relativeTime)
        return dayjs.unix(this.timestamp).fromNow()
    }

    get date_format() {
        return dayjs(this.date_purchased).format('DD - MMMM - YYYY')
    }
}