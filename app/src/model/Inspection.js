import dayjs from 'dayjs';

export class Inspection {
    constructor (publicKey, accountData) {
        this.publicKey = publicKey
        this.author = accountData.author
        this.timestamp = accountData.timestamp.toString()
        this.inspector_name = accountData.inspectorName
        this.inspected = accountData.inspected
        this.i_comment = accountData.iComment
        this.maintenance_batch = accountData.maintenanceBatch
        this.vessel_part_id_fkey = accountData.vesselPartIdFkey
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
        return dayjs.unix(this.timestamp).fromNow()
    }
}