import { useEffect, useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import { getCurrentConfig, changeForm, addChain, getUploadedConfig } from '../actions/routerActions';
import { RootState } from '../store/store';
import { routerState } from '../reducers/routerReducer';
import { ChainCard } from '../components/ChainCard';
import { useForm } from '../hooks/useForm';
import AceEditor from "react-ace";
import 'brace/mode/javascript';
import 'brace/mode/json';
import 'brace/theme/monokai';
import 'brace/theme/terminal';
import 'brace/ext/language_tools';
import { MdContentCopy } from 'react-icons/md';
import { toastMessage } from '../helpers/AlertMessages';
import { jsonSanitizer } from '../helpers/sanitizer';
import { aceEditorStyle, customStyles } from '../helpers/styles';

export const HomeScreen = () => {

    const { config, domainIds } = useSelector<RootState, routerState>(state => state.router);
    const { sequencerUrl, 
            server, 
            logLevel, 
            web3SignerUrl, 
            redis, 
            chains, 
            mnemonic, 
            subgraphPollInterval, 
            maxSlippage
       } = config;
    const dispatch = useDispatch();
    const [modalIsOpen, setIsOpen] = useState<boolean>(false);
    const {domain, onChange, resetForm} = useForm({
        domain: ''
    });

    const nxtp_logo = require('../assets/logo.png');

    const handleChange = (event:ChangeEvent<HTMLInputElement>, index:string = '', domainId:string = '', action:string = 'changeForm') => {
        dispatch(changeForm(event.target.name, event.target.value, index, domainId, action));
    };

    useEffect(() => {
        dispatch(getCurrentConfig() as any);
    }, [dispatch]);

    const handleNewChain = () => {
        dispatch(addChain(domain))
        resetForm();
        closeModal();
    };

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = ()=> {
        setIsOpen(false);
    };

    const handleUpload = (e:ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader()
        if(e.target.files){
            fileReader.readAsText(e.target.files[0], "UTF-8");
            fileReader.onload = e => {
                if(e && e.target){
                    if(e.target.result){
                        dispatch(getUploadedConfig(e.target.result) as any);
                    };
                };
            };
        }
    };
   
    const handleCopy = () => {
        navigator.clipboard.writeText(jsonSanitizer(config));

        toastMessage.fire({
            icon: 'success',
            title: 'Config copied to clipboard'
        });   
    };


    return (
        <div className="home-container">
            <div className="nxtp-logo-container">
                <img src={nxtp_logo} className="nxtp-logo" alt="nxtp logo"/>
                <label>Router Config Generator</label>
            </div>
            <hr/>
            <div className="options-container">
                <div style={{marginLeft: 10}}>
                    
                    <div className="mb-3">
                        <label className="form-label">(Optional) Upload your config</label>
                        <div>
                            <input type="file" className="form-control" name="upload" style={{width: 600}} onChange={handleUpload}/>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Log Level</label>
                        <div>
                            <input type="text" style={{width: 130}} className="form-control" name="logLevel" value={logLevel ? logLevel : ''} onChange={handleChange} placeholder="Log level" maxLength={10}/>
                            <p className="description-label">Log level (info|debug|error|trace)</p>
                        </div> 
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Sequencer Url</label>
                        <div>
                            <input type="text" style={{width: 600}} className="form-control" name="sequencerUrl" value={sequencerUrl ? sequencerUrl : ''} onChange={handleChange} placeholder="Sequencer Url"/>
                            <p className="description-label">The URL of the sequencer</p>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">web3Signer Url</label>
                        <div>
                            <input type="text" style={{width: 600}} className="form-control" name="web3SignerUrl" value={web3SignerUrl ? web3SignerUrl : ''} onChange={handleChange} placeholder="web3signer Url"/>
                            <p className="description-label">Recommended. The URL for a running Web3Signer instance. This is the recommended approach to private key storage</p>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">mnemonic</label>
                        <div>
                            <input type="text" style={{width: 600}} className="form-control" name="mnemonic" value={mnemonic ? mnemonic : ''} onChange={handleChange} placeholder="mnemonic"/>
                            <p className="description-label">Optional, Discouraged. The mnemonic used to generate the private key. <br/> Using the mnemonic directly in the config file is unsafe and not recommended.</p>
                        </div>
                    </div>
                    <div className="group-container">
                        <div className="title">
                            <label className="form-label">Redis</label>
                        </div>
                        <div>
                            <div className="mb-3 ms-2">
                                <label className="form-label">Host</label>
                                <input type="text" className="form-control" style={{width: 130}} name="host" value={(redis && redis.host) ? redis.host : ''} onChange={(event) => handleChange(event,'','','changeFormRedis')} placeholder="Redis host"/>
                                <p className="description-label">The hostname of the redis instance</p>
                            </div>
                            <div className="mb-3 ms-2">
                                <label className="form-label">Port</label>
                                <input type="number" className="form-control" style={{width: 130}} name="port" value={(redis && redis.port) ? redis.port : ''} onChange={(event) => handleChange(event,'','','changeFormRedis')} placeholder="Redis port"/>
                                <p className="description-label">The port of the redis instance</p>
                            </div>
                        </div>
                    </div>
                    <div className="group-container">
                        <div className="title">
                            <label className="form-label">Server</label>
                        </div>
                        <div className="mb-3 ms-2">
                            <label className="form-label">Admin Token</label>
                            <input type="text" className="form-control" style={{width: 600}} name="adminToken" value={(server && server.adminToken)? server.adminToken : ''} onChange={(event) => handleChange(event,'','','changeFormServer')} placeholder="Server adminToken"/>
                            <p className="description-label">Required. Secret token used to authenticate admin requests</p>
                        </div>
                        <div className="mb-3 ms-2">
                            <label className="form-label">Port</label>
                            <input type="number" className="form-control" style={{width: 130}} name="port" value={(server && server.port) ? server.port : ''} onChange={(event) => handleChange(event,'','','changeFormServer')} placeholder="Server Port"/>
                            <p className="description-label">Optional. The port the router will listen on. Defaults to 8080</p>
                        </div>
                        <div className="mb-3 ms-2">
                            <label className="form-label">Host</label>
                            <input type="text" className="form-control" style={{width: 130}} name="host" value={(server && server.host) ? server.host : ''} onChange={(event) => handleChange(event,'','','changeFormServer')} placeholder="Server Host"/>
                            <p className="description-label">Optional. The host the router will listen on. Defaults to 0.0.0.0</p>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">subgraphPollInterval</label>
                        <div>
                            <input type="text" style={{width: 600}} className="form-control" name="subgraphPollInterval" value={subgraphPollInterval ? subgraphPollInterval : ''} onChange={handleChange} placeholder="SubgraphPollInterval"/>
                            <p className="description-label">Optional. Control the subgraph poll interval in milliseconds. Defaults to 15_000 (15 seconds)</p>
                        </div>
                    </div>
                    <div className="mb-5">
                        <label className="form-label">maxSlippage</label>
                        <div>
                            <input type="text" style={{width: 600}} className="form-control" name="maxSlippage" value={maxSlippage ? maxSlippage : ''} onChange={handleChange} placeholder="MaxSlippage"/>
                            <p className="description-label">Optional. The maximum amount of slippage to allow in transfers</p>
                        </div>
                    </div>
                    <div style={{width: 800, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                        <label className="form-label">Chains/Assets</label>
                        <label className="description-label">Required. The chain configuration</label>
                    </div>
                    {
                        domainIds.map((chain, index) => (
                            <div className="mb-3" key={chain.toString()}>
                                <ChainCard domainId={chain} index={index} key={chain.toString()}/>
                            </div>
                        ))
                    }
                    <div className="button-container">
                        <button type="button" className="btn new-chain" onClick={openModal}>New chain</button>
                    </div>
                </div>
                <div style={{position: 'fixed', right: 0, width: '30vw'}}>
                    <AceEditor
                        placeholder="Router config"
                        mode="json"
                        theme="terminal"
                        name="jsonEditor"
                        style={aceEditorStyle}
                        fontSize={14}
                        showPrintMargin
                        showGutter
                        highlightActiveLine
                        value={jsonSanitizer(config)}
                        setOptions={{
                            enableBasicAutocompletion: false,
                            enableLiveAutocompletion: false,
                            enableSnippets: false,
                            showLineNumbers: true,
                            tabSize: 2,
                            readOnly: true,
                            vScrollBarAlwaysVisible: true
                        }}
                    />
                    <div className="copy-container">
                        <MdContentCopy size={20} onClick={handleCopy} className="icon"/>
                    </div>                    
                </div>
            </div>
            
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Asset Modal"
            >
                <h2>Chain</h2>
                <form className="chain-modal">
                    <input type="text" className="form-control" name='domain' value={domain} onChange={onChange} placeholder="Domain Id"/>
                    <button type="button" className="btn btn-dark me-3" onClick={handleNewChain}>Add</button>
                    <button type="button" className="btn btn-dark" onClick={closeModal}>Cancel</button>
                </form>
            </Modal>
        </div>
    )
}
