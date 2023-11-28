import React, { useEffect, useState } from 'react'
import { Form, Checkbox, Radio, Input, Select, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import ListCard from '../components/ListCard';


const API_URL = import.meta.env.VITE_REACT_APP_BASE_API_URL;
const Search = () => {
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [showMore, setShowMore] = useState(false);
	const [listings, setListings] = useState([]);

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get('searchTerm');
		const typeFromUrl = urlParams.get('type');
		const parkingFromUrl = urlParams.get('parking');
		const furnishedFromUrl = urlParams.get('furnished');
		const offerFromUrl = urlParams.get('offer');
		const sortFromUrl = urlParams.get('sort');
		const orderFromUrl = urlParams.get('order');

		if (
			searchTermFromUrl ||
			typeFromUrl ||
			parkingFromUrl ||
			furnishedFromUrl ||
			offerFromUrl ||
			sortFromUrl ||
			orderFromUrl
		) {
			const amenities = [];
			if (parkingFromUrl && parkingFromUrl === 'true') amenities.push('parking');
			if (furnishedFromUrl && furnishedFromUrl === 'true') amenities.push('furnished');
			if (offerFromUrl && offerFromUrl === 'true') amenities.push('offer');

			console.log('amenities',amenities)

			form.setFieldsValue({
				searchTerm: searchTermFromUrl || '',
				listType: typeFromUrl || 'all',
				amenities: amenities,
				sort: sortFromUrl || 'time',
				order: orderFromUrl || 'desc',
			})
		}

		const fetchListings = async () => {
			setLoading(true);
			setShowMore(false);
			const searchQuery = urlParams.toString();
			const res = await fetch(API_URL + `/api/listing/search?${searchQuery}`);
			const result = await res.json();

			if (result.success) {

				console.log('listings:', result.data)

				setListings(result.data)
				setShowMore(result.data.length > 8);
			} else {
				console.log('error', result.message)
				setListings([])
			}

			setLoading(false);
		};

		fetchListings();

	}, [location.search])



	const handleFormFinish = async (data) => {
		const urlParams = new URLSearchParams(location.search);

		urlParams.set('searchTerm', data.searchTerm || '');
		urlParams.set('type', data.listType || 'all');
		urlParams.set('parking', data.amenities.includes('parking'));
		urlParams.set('furnished', data.amenities.includes('furnished'));
		urlParams.set('offer', data.amenities.includes('offer'));
		urlParams.set('sort', data.sort || 'id');
		urlParams.set('order', data.order || 'desc');

		const searchQuery = urlParams.toString()

		console.log(searchQuery)

		navigate(`/search?${searchQuery}`);
	};

	return (
		<main className='flex flex-col md:flex-row'>
			<div className='flex flex-col min-w-max max-w-lg md:min-h-screen border-b-2 md:border-x-2 p-7'>
				<Form
					form={form}
					onFinish={handleFormFinish}
					name='list-form'
					autoComplete='off'
					labelCol={{ flex: '80px' }}
					wrapperCol={{ span: 20 }}
					initialValues={{
						searchTerm: '',
						listTupe: 'all',
						amenities: [],
						sort: 'id',
						order: 'desc'
					}}
				>
					<Form.Item label='Search' name='searchTerm'>
						<Input />
					</Form.Item>

					<Form.Item label='Type' name='listType'>
						<Radio.Group>
							<Radio value={'sell'}>Sell</Radio>
							<Radio value={'rent'}>Rent</Radio>
							<Radio value={'all'}>Sell & Rent</Radio>
						</Radio.Group>
					</Form.Item>

					<Form.Item label='Amenities' name='amenities'>
						<Checkbox.Group>
							<Checkbox value={'parking'}>Parking Spot</Checkbox>
							<Checkbox value={'furnished'}>Furnished</Checkbox>
							<Checkbox value={'offer'}>Offer</Checkbox>
						</Checkbox.Group>
					</Form.Item >

					<Form.Item label='Sort' name='sort'>
						<Select
							sytle={{ width: 150, }}
							options={[
								{ label: 'CreateTime', value: 'id' },
								{ label: 'Price', value: 'price' },
							]}
						/>
					</Form.Item>
					<Form.Item label='Order' name='order'>
						<Radio.Group>
							<Radio value={'desc'}>Desc</Radio>
							<Radio value={'asc'}>Asc</Radio>
						</Radio.Group>
					</Form.Item>

					<button
						type='submit'
						className='bg-slate-700 text-white p-3 w-full rounded-lg hover:opacity-90'
					>Search</button>

				</Form>
			</div>

			<div className='flex-1 px-4'>
				<h1 className='text-3xl font-semibold border-b pb-3 px-4 text-slate-700 mt-5'>
					Listing results:
				</h1>

				{loading && (<div>Loading...</div>)}

				{!loading && listings.length === 0 && (<p className='text-xl text-slate-700'>No listing found!</p>)}

				{!loading && listings.length > 0 &&
					<div className='flex-1 flex flex-row flex-wrap gap-8 px-4 mt-7'>
						{listings.map(listing => (
							<ListCard key={listing.id} listing={listing} />
						))}
					</div>

				}
			</div>
		</main>
	)
}

export default Search