//TODO: Improve/optimize the sanitizer
export const jsonSanitizer = (config:any) => {
    const longitud = Object.entries(config).length;
    let valuesExport = config;

    for(let i = 0; i < longitud; i++){            
        if(valuesExport.redis && Object.entries(valuesExport)[i][0] === "redis"){
            let redis:any = Object.entries(config)[i][1];

            for(let x = 0; x < Object.keys(redis).length; x++){
                if(Object.entries(redis)[x][1] === "" || Object.entries(redis)[x][1] === 0 || Object.entries(redis)[x][1] === undefined) {
                    delete valuesExport.redis[Object.keys(redis)[x]];
                };
            };

            if(Object.values(valuesExport.redis).length === 0){
                valuesExport.redis = undefined;
            };
        };

        if(valuesExport.server && Object.entries(valuesExport)[i][0] === "server"){
            let server:any = Object.entries(config)[i][1];

            for(let x = 0; x < Object.keys(server).length; x++){
                if(Object.entries(server)[x][1] === "" || Object.entries(server)[x][1] === 0 || Object.entries(server)[x][1] === undefined) {
                    delete valuesExport.server[Object.keys(server)[x]];
                };
            };

            if(Object.values(valuesExport.server).length === 0){
                valuesExport.server = undefined;
            };
        };

        if(valuesExport.chains && Object.entries(valuesExport)[i][0] === "chains"){
            let chains:any = Object.entries(config)[i][1];
            const chainsQuantity = Object.entries(valuesExport.chains).length;

            for(let n = 0; n < chainsQuantity; n++){
                let chainValues:any = Object.entries(chains)[n][1];

                for(let v = 0; v <  Object.keys(chainValues).length; v++){
                    if(Object.entries(chainValues)[v][1] === "" || Object.entries(chainValues)[v][1] === 0 || Object.entries(chainValues)[v][1] === undefined){
                        delete valuesExport.chains[Object.keys(chains)[n]][Object.keys(chainValues)[v]];
                    };

                    if(Object.entries(chainValues)[v][0] === 'subgraph'){
                        let subgraph:any = Object.entries(chainValues)[v][1];

                        for(let k = 0; k < Object.keys(subgraph).length; k++){
                            if(Object.entries(subgraph)[k][1] === "" || Object.entries(subgraph)[k][1] === 0 || Object.entries(subgraph)[k][1] === undefined){
                                delete valuesExport.chains[Object.keys(chains)[n]][Object.keys(chainValues)[v]][Object.keys(subgraph)[k]];
                            };
                        }
                    };
                };
                
            };
        };
        
        if(Object.entries(valuesExport)[i][1] === "") {
            valuesExport[Object.entries(valuesExport)[i][0]] = undefined;
        };
    };

    return JSON.stringify(valuesExport,null,4)
};
