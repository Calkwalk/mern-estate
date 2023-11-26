import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { PlusOutlined } from '@ant-design/icons';
import { Form, Button, Checkbox, Input, InputNumber, Upload, message, Row, Col, Modal } from 'antd';

import { uniqueArrayMerge } from '../utils/tools';

const API_URL = import.meta.env.VITE_REACT_APP_BASE_API_URL;
const { TextArea } = Input;
// const getBase64 = (img, callback) => {
// 	const reader = new FileReader();
// 	reader.addEventListener('load', () => callback(reader.result));
// 	reader.readAsDataURL(img);
// };
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const UpdateList = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { currentUser } = useSelector((state) => state.user);

    const [listing, setListing] = useState();
    const [defaultFileList, setDefaultFileList] = useState([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [fileList, setFileList] = useState([]);
    const [listTypes, setListTypes] = useState(['rent']);

    const [uploading, setUploading] = useState(false);

    const [formDataChanged, setFormDataChanged] = useState(false);

    const [form] = Form.useForm();

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.id;

            const res = await fetch(API_URL + '/api/listing/' + listingId, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const result = await res.json();

            const listing = result.data

            form.setFieldsValue({
                listName: listing.listName,
                description: listing.description,
                address: listing.address,
                beds: listing.beds,
                baths: listing.baths,
                price: listing.price
            });
            setListTypes(JSON.parse(listing.types));

            const images = JSON.parse(listing.images)
            let imageList = [];
            images.map(img => {
                imageList.push({
                    uid: img.filename,
                    name: img.originalname,
                    status: 'done',
                    url: API_URL + '/assets/upload/' + img.filename
                })
            })

            setDefaultFileList(imageList);
            setFileList(imageList);

            if (result.success) { setListing(listing) };

        };

        fetchListing();
    }, []);

    const handleFormFinish = async (data) => {
        // do nothing while form data not changed.
        if (!formDataChanged) return;

        // Save Info to Db
        const list = { ...data, types: listTypes }
        try {
            setUploading(true)
            const res = await fetch(API_URL + '/api/listing/update/' + params.id, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(list),
            })
            const result = await res.json();
            if (result.success) {
                const listingId = result.data.id;
                handleUpload(listingId);
            }
        } catch (error) {
            message.error(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleUploadChange = ({ file, fileList }) => {
        setFileList(fileList);
        if (file.status !== 'uploading') {
            console.log(file, fileList);
        }
        if (file.status === 'done') {
            console.log('upload:', file.response.data);
            file.uploadName = file.response.data
            // message.success(`${file.name} file uploaded successfully`);
            // getBase64(file.originFileObj, (url) => {
            // 	console.log('url', url)
            // })
        } else if (file.status === 'error') {
            message.error(`${file.name} file upload failed.`);
        }
    };

    const handleUploadRemove = async (file) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(newFileList);
        if (file.uploadName) {
            console.log('remove:', file.uploadName);
            const res = await fetch(API_URL + '/api/file/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // credentials: 'include' (for axios)
                body: JSON.stringify({
                    fileName: file.uploadName
                })
            });

            const result = await res.json();

            if (result.success) {
                message.info('Remove file completed.')
            } else {
                message.warning('Somthing is wrong on remove file.')
            }
        }
    };

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        // console.log(file)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleBeforeUpload = (file) => {
        console.log(fileList)

        return false;

    }

    const uploadProps = {
        action: API_URL + '/api/file/upload',
        withCredentials: true,
        accept: 'image/jpeg, image/png',
        fileList: fileList,
        defaultFileList: defaultFileList,
        beforeUpload: handleBeforeUpload,
        onChange: handleUploadChange,
        onRemove: handleUploadRemove,
        onPreview: handlePreview
    };

    const optionsWithListType = [
        { label: 'Sell', value: 'sell' },
        { label: 'Rent', value: 'rent' },
        { label: 'Packing spot', value: 'packing-spot' },
        { label: 'Furnished', value: 'furnished' },
        { label: 'Offer', value: 'offer' },
    ];

    const handleListTypeChange = (checkedValues) => {
        setListTypes(checkedValues);
    };

    const handleUpload = (listingId) => {
        if (fileList.length === 0) {
            setFormDataChanged(false)
            return;
        }

        setUploading(true);

        const formData = new FormData();
        fileList.forEach((file) => {
            const uploadedFile = defaultFileList.find(item => item.uid === file.uid)
            if (!uploadedFile) {
                formData.append('listingId', listingId);
                formData.append('files', file.originFileObj);
                console.log(file.name)
            }

        });

        // You can use any AJAX library you like
        fetch(API_URL + '/api/file/uploads', {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.success) {
                    setDefaultFileList(uniqueArrayMerge(defaultFileList, fileList, 'uid'))
                    setFormDataChanged(false);
                    message.success('upload successfully.');
                } else {
                    message.error('upload images error')
                }

            })
            .catch((e) => {
                console.log(e)
                message.error('upload failed.');
            })
            .finally(() => {
                setUploading(false);
            });
    }

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Edit a List</h1>

            <Form
                form={form}
                onFinish={handleFormFinish}
                onChange={() => setFormDataChanged(true)}
                name='list-form'
                autoComplete='off'
                labelCol={{ flex: '110px' }}
                initialValues={{ beds: 1, baths: 1, price: 9.9 }}
            >
                <div className='flex flex-col sm:flex-row gap-6'>
                    <div>
                        <Form.Item label='List Name' name='listName' initialValue={listing?.listName} value={'abcadsb'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your list name!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item label='Description' name='description'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input something for your list!',
                                },
                            ]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>

                        <Form.Item label='Address' name='address'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your address!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item label='Type'>
                            <Checkbox.Group options={optionsWithListType} value={listTypes} onChange={handleListTypeChange} />
                        </Form.Item >

                        <Form.Item label='Quantity'>
                            <Row gutter={24}>
                                
                                <Col>
                                    <Form.Item name='beds' noStyle>
                                        <InputNumber min={1} max={99} />
                                    </Form.Item>
                                    <span className="ml-2 text-red-400" >
                                        Beds
                                    </span>
                                </Col>

                                <Col>
                                    <Form.Item name='baths' noStyle>
                                        <InputNumber min={1} max={99} />
                                    </Form.Item>
                                    <span className="ml-2 text-red-400" >
                                        Baths
                                    </span>
                                </Col>
                                
                            </Row>

                        </Form.Item>

                        <Form.Item label='Price'>
                            <Form.Item name='price' noStyle>
                                <InputNumber min={0.01} max={9999999.99} />
                            </Form.Item>
                            <span className="ml-2 text-red-400 text-xs pt-4" >
                                $/Month
                            </span>
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item label="Images:">
                            <div> The first image will be the cover.(max: 6)</div>
                        </Form.Item>

                        <Form.Item label="Upload" valuePropName="fileList">
                            <Upload listType="picture-card" fileList={fileList} maxCount={6} {...uploadProps}>
                                <PlusOutlined />
                            </Upload>
                        </Form.Item>


                    </div>
                </div>
                <Form.Item label=''>
                    <div className='flex items-center justify-between my-8'>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={uploading}
                            className='bg-slate-700 w-[75%] h-12'
                        >
                            {uploading ? 'Uploading...' : 'Submit'}
                        </Button>

                        <Button
                            type="primary"
                            danger
                            disabled={uploading}
                            htmlType="reset"
                            onClick={() => { setFileList([]); setFormDataChanged(false); }}
                        >
                            reset
                        </Button>
                    </div>

                </Form.Item>
            </Form>

            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="image-preview" style={{ width: '100%' }} src={previewImage} />
            </Modal>

        </main>
    )
}

export default UpdateList