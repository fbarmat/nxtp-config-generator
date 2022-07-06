import { Asset, NxtpConfig } from "../interfaces/nxtpConfig";
import { defaultConfig } from '../helpers/defaultConfig';


export const getCurrentConfig = () => {
    return async(dispatch:any) => {        
        dispatch(currentConfig(defaultConfig));
    };
};

export const getUploadedConfig = (data?:string | ArrayBuffer) => {
    return async(dispatch:any) => {
        if(data){
            return dispatch(uploadedConfig(data as any));
        };
    };
};

export const currentConfig = (routerConfig:NxtpConfig) => ({
    type: 'currentConfig',
    payload: routerConfig
});

export const uploadedConfig = (routerConfig:NxtpConfig) => ({
    type: 'uploadedConfig',
    payload: routerConfig
});

export const changeForm = (name:string, value:string, index:string, domainId:string, action:string) => ({
    type: action,
    payload: {name, value, index, domainId}
});

export const addAsset = (asset:Asset, domainId:string) => ({
    type: 'addAsset',
    payload: {asset, domainId}
});

export const deleteAsset = (domainId:string, index:number) => ({
    type: 'deleteAsset',
    payload: {domainId, index}
});

export const deleteChain = (domainId:string) => ({
    type: 'deleteChain',
    payload: {domainId}
});

export const getDomainIds = (domainIds:string[]) => ({
    type: 'getDomainIds',
    payload: {domainIds}
});

export const addChain = (domainId:string) => ({
    type: 'addChain',
    payload: {domainId}
});

export const reset = () => ({
    type: 'reset'
});