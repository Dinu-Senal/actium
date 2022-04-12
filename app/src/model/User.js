import dayjs from 'dayjs';

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

    get author_display() {
        const author = this.author.toBase58()
        return author.slice(0,4) + '..' + author.slice(-4)
    }

    get created_at() {
        return dayjs.unix(this.timestamp).format('lll')
    }

    get created_ago() {
        return dayjs.unix(this.timestamp).fromNow()
    }
}