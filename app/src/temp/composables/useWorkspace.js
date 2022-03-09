/* eslint-disable react-hooks/rules-of-hooks */
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from "@solana/web3.js"
import { Program, Provider } from '@project-serum/anchor'
import idl from '../idl.json'

const preflightCommitment = 'processed'
const commitment = 'processed'
const programID = new PublicKey(idl.metadata.address)
const workspaceSymbol = Symbol()
const workspace = null

export const useWorkspace = () => workspace

export const initWorkspace = () => {
    const wallet = useWallet();
    const connection = new Connection('http://127.0.0.1:8899', commitment)
    const provider = new Provider(
        connection, wallet, { preflightCommitment, commitment }
    )
    const program = new Program(idl, programID, provider.value)
    workspace = {
        wallet,
        connection,
        provider,
        program
    }
}