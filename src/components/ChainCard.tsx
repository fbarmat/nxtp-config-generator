import { ChangeEvent, useState } from 'react';
import { Asset } from '../interfaces/nxtpConfig';
import { MdDeleteForever } from 'react-icons/md';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { routerState } from '../reducers/routerReducer';
import { addAsset, changeForm, deleteAsset, deleteChain } from '../actions/routerActions';
import { useForm } from '../hooks/useForm';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-wordpress-admin';
import { customStyles } from '../helpers/styles';


interface Props {
    index: number;
    domainId: string;
};


export const ChainCard = ({index, domainId}:Props) => {

    const dispatch = useDispatch();
    const {config} = useSelector<RootState, routerState>(state => state.router);
    const {chains} = config;
    const [modalIsOpen, setIsOpen] = useState(false);
    const {modalAssetAddress, modalAssetName, onChange, resetForm} = useForm({
        modalAssetName: '',
        modalAssetAddress: ''
    });

    Modal.setAppElement('#root');

    const handleAddAsset = (domainId:string) => {
        const asset:Asset = {
            name: modalAssetName,
            address: modalAssetAddress
        };

        dispatch(addAsset(asset,domainId));
        resetForm();
        closeModal();
    };

    const handleDeleteAsset = (domainId:string, index:number) => {
        Swal.fire({
            title: 'Do you want to delete the asset?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
          }).then((result) => {
            if(result.isConfirmed) dispatch(deleteAsset(domainId, index));
          });
    };

    const handleDeleteChain = (domainId:string) => {
        Swal.fire({
            title: 'Do you want to delete the chain?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
          }).then((result) => {
            if(result.isConfirmed) dispatch(deleteChain(domainId));
          });
    };

    const handleChange = (event:ChangeEvent<HTMLInputElement>, index:string = '', domainId:string = '', action:string = 'changeForm') => {
        dispatch(changeForm(event.target.name, event.target.value, index, domainId, action))
    };

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = ()=> {
        setIsOpen(false);
    };
    
    return (
        <div className="chain-container">
            <div className="chain-domain">
                <label>DOMAIN ID</label>
                <label>{domainId}</label>
            </div>
            <div style={{marginBottom:10, marginLeft: 10, marginRight: 10, display: 'flex'}}>
                <label style={{marginRight: 10}}>Providers</label>
                <input type="text" className="form-control" name='providers' value={chains[domainId].providers} onChange={(event) => handleChange(event, index.toString(), domainId, 'changeFormChain')} placeholder="RCP providers"/>
            </div>
            <div className="asset-container">
                <label>ASSETS</label>
                {
                    chains[domainId].assets.map( (asset, assetIndex) => (
                        <div className="inputs-container" key={assetIndex.toString()}>
                            <input type="text" style={{width: 100}} className="form-control me-3" name={'assetName'} value={asset.name} onChange={(event) => handleChange(event, assetIndex.toString(), domainId, 'changeFormChainAsset')} placeholder="Asset name"/>
                            <input type="text" className="form-control me-3" name={'assetAddress'} value={asset.address} onChange={(event) => handleChange(event, assetIndex.toString(), domainId, 'changeFormChainAsset')} placeholder="Asset Address" maxLength={42}/>
                            <MdDeleteForever size={25} onClick={() => handleDeleteAsset(domainId, assetIndex)}/>
                        </div>
                    ))
                }
                <div className="mb-3 button-container">
                    <button type="button" className="btn mt-3" onClick={openModal}>Add Asset</button>
                </div>
            </div>
            <div className="mb-3">
                <hr/>
            </div>
            <div className="accordion" id="accordionProperties">
                <div className="accordion-item" style={{backgroundColor: 'rgb(15,23,42,1)'}}>
                    <h2 className="accordion-header" id="headingOne">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseOne${domainId}`} aria-expanded="true" aria-controls={`collapseOne${domainId}`}>
                            Subgraph
                        </button>
                    </h2>
                    <div id={`collapseOne${domainId}`} className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <div className="mb-3">
                                <label className="form-label">Runtime</label>
                                <div>
                                    <input type="text"className="form-control" name="runtime" value={chains[domainId].subgraph?.runtime} onChange={(event) => handleChange(event, index.toString(), domainId, 'changeFormChainSubgraph')} placeholder=""/>
                                    <p className="description-label">Optional. An array of subgraph URLs for a chain. Additional URLs provide more fallback protection against subgraph issues. If not provided, will default to Connext's hosted subgraphs</p>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Analytics</label>
                                <div>
                                    <input type="text" className="form-control" name="analytics" value={chains[domainId].subgraph?.analytics} onChange={(event) => handleChange(event, index.toString(), domainId, 'changeFormChainSubgraph')} placeholder=""/>
                                    <p className="description-label">Optional. An array of subgraph URLs for a chain. Additional URLs provide more fallback protection against subgraph issues. If not provided, will default to Connext's hosted subgraphs.</p>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">MaxLag</label>
                                <div>
                                    <input type="text" className="form-control" name="maxLag" value={chains[domainId].subgraph?.maxLag} onChange={(event) => handleChange(event, index.toString(), domainId, 'changeFormChainSubgraph')} placeholder=""/>
                                    <p className="description-label">Optional. The number of blocks to allow the subgraph's latest block number to be behind the provider's latest block number. Defaults to the recommended value per chain</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="accordion-item" style={{backgroundColor: 'rgb(15,23,42,1)'}}>
                    <h2 className="accordion-header" id="headingTwo">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseTwo${domainId}`} aria-expanded="false" aria-controls={`collapseTwo${domainId}`}>
                        Additional Properties
                    </button>
                    </h2>
                    <div id={`collapseTwo${domainId}`} className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <div className="mb-3">
                                <label className="form-label">Confirmations</label>
                                <div>
                                    <input type="text" className="form-control" name="confirmations" value={chains[domainId].confirmations} onChange={(event) => handleChange(event, index.toString(), domainId, 'changeFormChain')} placeholder=""/>
                                    <p className="description-label">Optional. The number of confirmations required for a transaction to be considered valid on a chain. Defaults to defined values</p>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">MinGas</label>
                                <div>
                                    <input type="text" className="form-control" name="minGas" value={chains[domainId].minGas} onChange={(event) => handleChange(event, index.toString(), domainId, 'changeFormChain')} placeholder=""/>
                                    <p className="description-label">Optional. The minimum gas amount required to be held by the router's signer address in order to participate in auctions, specified in Wei. Defaults to 100000000000000000 (0.1 Ether)</p>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">GasStations</label>
                                <div>
                                    <input type="text" className="form-control" name="gasStations" value={chains[domainId].gasStations} onChange={(event) => handleChange(event, index.toString(), domainId, 'changeFormChain')} placeholder=""/>
                                    <p className="description-label">Optional. Array of gas station URLs, defaults to using the RPC's gas estimation.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-3">
                <hr/>
            </div>
            <div className="mb-3" style={{display: 'flex', justifyContent: 'center'}}>
                <button type="button" className="btn btn-danger mb-3 mt-1" onClick={() => handleDeleteChain(domainId)}>
                    Delete chain <MdDeleteForever size={20}/>
                </button>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Asset Modal"
            >
                <h2>Asset</h2>
                <form className="asset-modal">
                    <input type="text" className="form-control mb-3 me-3 name" name='modalAssetName' value={modalAssetName} onChange={onChange} placeholder="Asset name"/>
                    <input type="text" className="form-control mb-3" name='modalAssetAddress' value={modalAssetAddress} placeholder="Asset Address" onChange={onChange} maxLength={42}/>
                    <button type="button" className="btn btn-dark me-3" onClick={() => handleAddAsset(domainId)}>Add</button>
                    <button type="button" className="btn btn-dark" onClick={closeModal}>Cancel</button>
                </form>
            </Modal>
        </div>
    )
}
