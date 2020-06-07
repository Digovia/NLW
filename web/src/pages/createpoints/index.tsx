import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory  } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';
import axios from 'axios';
import DropZone from '../../components/dropzone';

import './styles.css';

import logo from '../../assets/logo.svg';

interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface IBGE_uf_response{
    sigla: string;
}

interface IBGE_city_response{
    nome: string;
}

const CreatePoints = () => {
    const [ items, setItems] = useState<Item[]>([]);
    const [ ufs , setUfs ] = useState<string[]>([]);
    const [ cities , setCities ] = useState<string[]>([]);
    const [ initialPosition, setInitialPosition ] = useState<[number, number]>([0,0]);

    const [ formData, setFormaData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });

    const [ selectedUf, setSelectedUf ] = useState('0');
    const [ selectedCity, setSelectedCity ] = useState('0');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [ selectedPosition, setSelectedPosition ] = useState<[number, number]>([0,0]);
    const [ selectedFile, setSelectedFile] = useState<File>();

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude }  = position.coords;

            setInitialPosition([latitude, longitude]);
        })
    }, []);

    useEffect(() => {
        api.get('items').then( response => {
            setItems(response.data);
        });
    }, []);

    useEffect(() => {
        axios.get<IBGE_uf_response[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then( response => {
            const ufInitials = response.data.map(uf => uf.sigla);
            setUfs(ufInitials);
        });
    }, [])

    useEffect(() => {
        if(selectedUf === '0'){
            return;
        }

        axios.get<IBGE_city_response[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then( response => {
            const cityNames = response.data.map(city => city.nome);
            setCities(cityNames);
        });

    }, [selectedUf])

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;
        setSelectedCity(city);
    }

    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value} = event.target;
        setFormaData({...formData, [name]: value})
    }

    function handleSelectedItem(id: number){
        const alreadySelected = selectedItems.findIndex(item => item ===id);
        if(alreadySelected >=0){
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);
        }else{
            setSelectedItems([...selectedItems, id]);    
        }    
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault();

        const { name, email, whatsapp} = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude,longitude] = selectedPosition;
        const items = selectedItems;

        const data  = new FormData();

        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));
        
        if(selectedFile){
            data.append('image', selectedFile);
        }

        await api.post('points', data);

        alert('Ponto cadastrado');

        history.push('/');
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/>ponto de coleta</h1>

                <DropZone onFileUploaded={setSelectedFile}/>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input type="text" name="name" id="name" onChange={handleInputChange}/>
                    </div>
                    <div className="field-group">
                    <div className="field">
                        <label htmlFor="name">Email</label>
                        <input type="Email" name="email" id="email" onChange={handleInputChange}/>
                    </div>
                    <div className="field">
                        <label htmlFor="name">Whatsapp</label>
                        <input type="text" name="ehatsapp" id="ehatsapp" onChange={handleInputChange}/>
                    </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereços</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>
                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer  
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        />
                        <Marker position={selectedPosition}/>
                    </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                                <option value="">Selecione um Estado</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}> {uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidde</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}> 
                                <option value="">Selecione uma Cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}> {city  }</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li 
                                key={item.id} 
                                onClick={ () => handleSelectedItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
    )

}

export default CreatePoints;