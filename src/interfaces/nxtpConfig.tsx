// Generated by https://quicktype.io

export interface NxtpConfig {
    logLevel:               string;
    sequencerUrl:           string;
    web3SignerUrl:          string;
    mnemonic?:              string;
    subgraphPollInterval?:  string;
    maxSlippage?:           string;
    redis:                  Redis;
    server:                 Server;
    chains:                 { [key: string]: Chain };
}

export interface Chain {
    assets:         Asset[];
    providers:      string[];
    subgraph?:      Subgraph;
    confirmations?: string;
    minGas?:        string;
    gasStations?:   string;
}

export interface Subgraph {
    runtime?:   string;
    analytics?: string;
    maxLag?:    string;  
}

export interface Asset {
    address: string;
    name:    string;
}

export interface Redis {
    host: string;
    port: number;
}

export interface Server {
    adminToken: string;
    port:       number;
    host?:      string;
}
