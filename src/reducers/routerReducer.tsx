import { Chain, NxtpConfig, Server, Redis, Asset } from '../interfaces/nxtpConfig';

type actionRouter = 
| {type: 'currentConfig', payload: NxtpConfig}
| {type: 'uploadedConfig', payload: NxtpConfig}
| {type: 'changeForm', payload: {name:string, value:string, index:string, domainId:string}}
| {type: 'changeFormRedis', payload: {name:string, value:string, index:string, domainId:string}}
| {type: 'changeFormServer', payload: {name:string, value:string, index:string, domainId:string}}
| {type: 'changeFormChain', payload: {name:string, value:string, index:string, domainId:string}}
| {type: 'changeFormChainAsset', payload: {name:string, value:string, index:string, domainId:string}}
| {type: 'changeFormChainSubgraph', payload: {name:string, value:string, index:string, domainId:string}}
| {type: 'changeFormChainAssetAddress', payload: {name:string, value:string, index:string, domainId:string}}
| {type: 'addAsset', payload: {asset:Asset, domainId:string}}
| {type: 'deleteAsset', payload: {domainId:string, index:string}}
| {type: 'deleteChain', payload: {domainId:string}}
| {type: 'addChain', payload: {domainId:string}}


export interface routerState {
    config:{
        logLevel:      string;
        sequencerUrl:  string;
        web3SignerUrl: string;
        mnemonic?:     string;
        subgraphPollInterval?: string;
        maxSlippage?:  string;
        redis:         Redis;
        server:        Server;
        chains:        { [key: string]: Chain };
    },
    domainIds:     string[];
};

const initialState:routerState = {
    config:{
        logLevel: '',
        sequencerUrl: '',
        web3SignerUrl: '',
        mnemonic: '',
        subgraphPollInterval: '',
        maxSlippage: '',
        redis: {
            host: '',
            port: 0
        },
        server: {
            adminToken: '',
            port: 0,
            host: ''
        },
        chains: {},
    },
    domainIds: []
};

export const routerReducer = (state:routerState = initialState, action:actionRouter):routerState => {

    switch (action.type) {
        case 'currentConfig':

            let domains:string[] = [];
            for (const key in action.payload.chains) {
                domains.push(key);
            };

            return {
                ...state,
                config:{
                    logLevel: action.payload.logLevel,
                    sequencerUrl: action.payload.sequencerUrl,
                    web3SignerUrl: action.payload.web3SignerUrl,
                    mnemonic: action.payload.mnemonic,
                    subgraphPollInterval: action.payload.subgraphPollInterval,
                    maxSlippage: action.payload.maxSlippage,
                    redis: {
                        host: action.payload.redis.host,
                        port: action.payload.redis.port
                    },
                    server: {
                        adminToken: action.payload.server.adminToken,
                        port: action.payload.server.port,
                        host: action.payload.server.host
                    },
                    chains: action.payload.chains,
                },
                domainIds: domains
            };

        case 'changeForm':
            return {
                ...state,
                config:{
                    ...state.config,
                    [action.payload.name]: action.payload.value
                }
            };
        
        case 'changeFormRedis':
            let redisValue;

            if(action.payload.name === 'port'){
                redisValue = Number(action.payload.value)
            }else{
                redisValue = action.payload.value;
            };

            return {
                ...state,
                config:{
                    ...state.config,
                    redis:{
                        ...state.config.redis,
                        [action.payload.name]: redisValue
                    }
                }
            };

        case 'changeFormServer':
            let serverValue;

            if(action.payload.name === 'port'){
                serverValue = Number(action.payload.value)
            }else{
                serverValue = action.payload.value;
            };

            return {
                ...state,
                config:{
                    ...state.config,
                    server:{
                        ...state.config.server,
                        [action.payload.name]: serverValue
                    }
                }
            };

        case 'changeFormChain':
            const chainConfigArrays = ['gasStations', 'providers'];

            let newValue;
            if(chainConfigArrays.includes(action.payload.name)){
                if(action.payload.value.length === 0){
                    newValue = undefined;
                }else{
                    newValue = [action.payload.value];
                };
            }else{
                newValue = action.payload.value
            };

            return {
                ...state,
                config:{
                    ...state.config,
                    chains:{
                        ...state.config.chains,
                        [action.payload.domainId]: 
                        {
                            ...state.config.chains[action.payload.domainId],
                            [action.payload.name]: newValue
                        }
                    }
                }
            };


        case 'changeFormChainAsset':
            const newAsset:Asset[] = [];

            state.config.chains[action.payload.domainId].assets.map((asset, assetIndex) => {
                    if(action.payload.name === 'assetName'){
                        assetIndex === Number(action.payload.index) && (asset.name = action.payload.value)
                        return newAsset.push(asset);
                    }else{
                        assetIndex === Number(action.payload.index) && (asset.address = action.payload.value)
                        return newAsset.push(asset);
                    };
                }
            );


            return {
                ...state,
                config:{
                    ...state.config,
                    chains:{
                        ...state.config.chains,
                        [action.payload.domainId]: 
                        {
                            ...state.config.chains[action.payload.domainId],
                            assets: [...newAsset]
                        }
                    }
                }
            };

        case 'changeFormChainSubgraph':
            const subgraphArrays = ['runtime', 'analytics'];
            let newSubgraphValue;

            if(subgraphArrays.includes(action.payload.name)){
                if(action.payload.value.length === 0){
                    newSubgraphValue = undefined;
                }else{
                    newSubgraphValue = [action.payload.value];
                };
            }else{
                newSubgraphValue = action.payload.value;
            };

            return {
                ...state,
                config:{
                    ...state.config,
                    chains:{
                        ...state.config.chains,
                        [action.payload.domainId]: 
                        {
                            ...state.config.chains[action.payload.domainId],
                            subgraph: {
                                ...state.config.chains[action.payload.domainId].subgraph,
                                [action.payload.name]: newSubgraphValue
                            }
                        }
                    }
                }
            };

        case 'addAsset':
            return {
                ...state,
                config:{
                    ...state.config,
                    chains:{
                        ...state.config.chains,
                        [action.payload.domainId]: 
                        {
                            assets: [
                                ...state.config.chains[action.payload.domainId].assets,
                                action.payload.asset
                            ],
                            providers: [...state.config.chains[action.payload.domainId].providers]
                        }
                    }
                }
            };

        case 'deleteAsset':
            return {
                ...state,
                ...state.config.chains[action.payload.domainId].assets.splice(Number(action.payload.index),1)
            };

        case 'deleteChain':
            const newConfig:routerState = {...state};

            delete newConfig.config.chains[action.payload.domainId];

            let domainIds:string[] = [];
            for (const key in newConfig.config.chains) {
                domainIds.push(key);
            };

            return {
                ...newConfig,
                domainIds
            };

        case 'addChain':
            const newChain = {...state}

            if(!newChain.config.chains){
                newChain.config.chains = {[action.payload.domainId]: {assets:[], providers:[]}}
            };
            newChain.config.chains[action.payload.domainId] = {assets:[], providers:[]}
            
            let domainss:string[] = [];
            for (const key in newChain.config.chains) {
                domainss.push(key);
            };

            return {
                ...newChain,
                domainIds: domainss
            };
        
        case 'uploadedConfig':
            const uploadedConfig = JSON.parse(action.payload as any);

            let domainssss:string[] = [];
            for (const key in uploadedConfig.chains) {
                domainssss.push(key);
            };

            return {
                config:{
                    logLevel: uploadedConfig.logLevel,
                    sequencerUrl: uploadedConfig.sequencerUrl,
                    web3SignerUrl: uploadedConfig.web3SignerUrl,
                    mnemonic: uploadedConfig.mnemonic,
                    subgraphPollInterval: uploadedConfig.subgraphPollInterval,
                    maxSlippage: uploadedConfig.maxSlippage,
                    redis: {
                        host: uploadedConfig.redis ? uploadedConfig.redis.host : '',
                        port: uploadedConfig.redis ? uploadedConfig.redis.port : ''
                    },
                    server: {
                        adminToken: uploadedConfig.server ? uploadedConfig.server.adminToken : '',
                        port: uploadedConfig.server ? uploadedConfig.server.port : '',
                        host: uploadedConfig.server ? uploadedConfig.server.host : ''
                    },
                    chains: uploadedConfig.chains,
                },
                domainIds: domainssss
            };

        default:
            return state;
    };
}