import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import api from '../../services/api';
import axios from 'axios';
import Dropzone from '../../components/Dropzone';

import './styles.css';
import logo from '../../assets/logo.svg';
import { FiArrowLeft } from 'react-icons/fi';

interface Item {
  id: number;
  image_url: string;
  title: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

function HandleInitialPosition() {
  const map = useMap();
  useEffect(() => {
    map.locate().on('locationfound', function (e) {
      map.flyTo(e.latlng, 15);
    });
  }, [map]);
  return null;
}

const CreatePoint: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('0');
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedPosition, setSelectedPosition] = useState<[number,number]>([0, 0]);
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '' });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();
//  const [initialPosition, setInitialPosition] = useState<[number,number]>([0, 0]);
  const navigate = useNavigate();

//  useEffect(() => {
//    navigator.geolocation.getCurrentPosition(position => {
//      const {latitude, longitude} = position.coords;
//      
//      setInitialPosition([latitude, longitude]);
//    });
//  }, []);

  useEffect(() => {
    api.get('/items').then(response => {
      setItems(response.data);
    })
  }, []);
 
  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);
      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    if (selectedUf === '0') return;
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => city.nome);
        setCities(cityNames);
    });   
  }, [selectedUf]);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedCity('0');
    setSelectedUf(event.target.value);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedCity(event.target.value);
  }

  function HandleMapClick() {
    const map = useMap();
    map.on('click', function (e) {
      const {lat, lng} = e.latlng;
      setSelectedPosition([lat, lng]);
    })
    return null;
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value })
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex(item => item === id);
    if (alreadySelected >= 0) {
      setSelectedItems(selectedItems.filter(item => item !== id));
      return;
    }
    setSelectedItems([...selectedItems, id]);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const {name, email, whatsapp} = formData;
    const [latitude, longitude] = selectedPosition;

    const data = new FormData();

    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', selectedUf);
    data.append('city', selectedCity);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', selectedItems.join(','));

    if (selectedFile) data.append('image', selectedFile);

    await api.post('/points', data);
    navigate('/');
  }

  return (
    <div id='page-create-point'>
      <header>
        <img src={logo} alt='Ecoleta' />
        <Link to='/'>
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>Cadastro do<br /> ponto de coleta</h1>
        <Dropzone onFileUploaded={setSelectedFile} />
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className='field'>
            <label htmlFor='name'>Nome da entidade</label>
            <input type='text' name='name' id='name' onChange={handleInputChange} autoComplete='off' />
          </div>
          <div className='field-group'>
            <div className='field'>
              <label htmlFor='email'>Email</label>
              <input type='email' name='email' id='email' onChange={handleInputChange} autoComplete='off' />
            </div>
            <div className='field'>
              <label htmlFor='whatsapp'>Whatsapp</label>
              <input type='text' name='whatsapp' id='whatsapp' onChange={handleInputChange} autoComplete='off' />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <MapContainer center={[0,0]} zoom={15}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
            <HandleInitialPosition />
            <HandleMapClick />
          </MapContainer>

          <div className='field-group'>
            <div className='field'>
              <label htmlFor='uf'>Estado (UF)</label>
              <select name='uf' id='uf' onChange={handleSelectUf} value={selectedUf}>
                <option value='0'>Selecione uma UF</option>
                {ufs.map(uf => (<option value={uf} key={uf}>{uf}</option>))}
              </select>
            </div>
            <div className='field'>
              <label htmlFor='city'>Cidade</label>
              <select name='city' id='city' onChange={handleSelectCity} value={selectedCity}>
                <option value='0'>Selecione uma cidade</option>
                {cities.map(city => (<option value={city} key={city}>{city}</option>))}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>
          <ul className='items-grid'>
            {items.map(item => (
              <li 
                key={item.id} 
                onClick={() => handleSelectItem(item.id)} 
                className={selectedItems.includes(item.id) ? 'selected' : '' }>
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
        <button type='submit'>Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
}

export default CreatePoint;

