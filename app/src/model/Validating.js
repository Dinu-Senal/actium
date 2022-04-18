import dayjs from 'dayjs';

export class Validating {
    constructor (publicKey, accountData) {
        this.publicKey = publicKey
        this.author = accountData.author
        this.timestamp = accountData.timestamp.toString()
        this.v_approval = accountData.vApproval
        this.v_comment = accountData.vComment
        this.vessel_imo_fkey = accountData.vesselImoFkey
    }

    get key() {
        return this.publicKey.toBase58()
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
}