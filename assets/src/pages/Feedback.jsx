import { useEffect, useState } from 'react';
import { __ } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";
import { Form, Card } from '@douyinfe/semi-ui';
import { Button, Col, Row, Typography, Notification, Space } from '@douyinfe/semi-ui';
import { IconSend } from '@douyinfe/semi-icons';
import {OnlineSurvey, OnlineSurveyDark} from '../lib/Illustrations';
import { BoxedLayout } from '../layouts';
import { PageInfo } from '../components';
import menuItems from '../data/menu.json';
const Feedback = () => {    
    const [initValues, setInitValues] = useState({
        subject: '',
        email: '',
        phone: '',
        message: '',
    });
    const [processing, setProcessing] = useState(false);
    const [formApi, setFormApi] = useState(null); // normal, processing, done

    const handleValuesChange = (values) => {
        // setFormValues(values);
        // if (settingsOld.current && settings.general) {
        //     const isChanged = JSON.stringify(values) !== JSON.stringify(settingsOld.current.general);
        //     setHasChanges(isChanged);
        // }
        setInitValues(values);
    };

    const handleForm = async (values) => {
        console.log(values);
        if (values.subject && values.message) {
            setProcessing(true);
            try {
                const result = await apiFetch({
                    path: "/mos-product-specifications-tab/v1/feedback",
                    method: "POST",
                    data: {
                        subject: values.subject,
                        email: values.email,
                        phone: values.phone,
                        message: values.message
                    },
                    headers: {
                        'X-WP-Nonce': mos_product_specifications_tab_ajax_obj.api_nonce
                    }
                });
                console.log(result);
                if (result.success) {
                    if (formApi) {
                        formApi.reset();
                    }
                    Notification.success({
                        title: __("Success", "mos-product-specifications-tab"),
                        content: __("Feedback send successfully!", "mos-product-specifications-tab"),
                        duration: 3,
                    });
                }

            } catch (error) {
                console.error(__("Mail Sending Error:", "mos-product-specifications-tab"), error);
                Notification.error({
                    title: __("Error", "mos-product-specifications-tab"),
                    content: __("Please try again!", "mos-product-specifications-tab"),
                    duration: 3,
                });
            } finally {
                setProcessing(false);
            }
        } else {
            Notification.warning({
                title: __("Warning", "mos-product-specifications-tab"),
                content: __("Subject or Message can't be Empty", "mos-product-specifications-tab"),
                duration: 3,
            });
        }
    };


    const {
        Input,
        InputNumber,
        Select,
        Cascader,
        DatePicker,
        TimePicker,
        TextArea,
        CheckboxGroup,
        Checkbox,
        RadioGroup,
        Radio,
        Slider,
        Rating,
        Switch,
        TagInput,
        Section,
        TreeSelect,
    } = Form;

    // const handleSubmit = (values) => {
    //     console.log(values);
    //     Toast.info('Submit Success');
    // };

    return (
        <BoxedLayout>
            <Card 
                    title={
                        <PageInfo menu={menuItems} url="/feedback"  />
                    }
                    // title="Title"
                    headerLine={true}
                >
                <Row type="flex" gutter={[24,24]} align="middle">
                    <Col sx={24} lg={12}>
                        <OnlineSurvey/>
                        {/* <IllustrationControl
                            image={<OnlineSurvey style={{ width: 530, height: 530 }} />}
                            darkModeImage={<OnlineSurveyDark style={{ width: 530, height: 530 }} />}
                        /> */}
                    </Col> 
                    <Col sx={24} lg={12}>
                        <Form
                            initValues={initValues}
                            // style={{ padding: 10, width: '100%' }}
                            // onValueChange={(v) => console.log(v)}
                            onValueChange={handleValuesChange}
                            // onSubmit={values => handleSubmit(values)}
                            onSubmit={handleForm}
                            getFormApi={setFormApi}
                        >
                            <div className="mb-3">
                                <Input
                                    field="subject"
                                    label={__("Subject", "mos-product-specifications-tab")}
                                    trigger="blur"
                                    // className="mt-2"
                                    rules={[
                                        { required: true, message: __('This field is required', "mos-product-specifications-tab") },
                                        { type: 'string', message: __('Invalid type', "mos-product-specifications-tab") },
                                        // { validator: (rule, value) => value === 'semi', message: 'not semi' }
                                    ]}
                                />
                            </div>
                            <div className="mb-3">
                                <Input                                
                                    field="email"
                                    label={__("Email", "mos-product-specifications-tab")}
                                    // trigger="blur"
                                    // className="mt-2"
                                    // rules={[
                                    //     { required: true, message: 'required Error' },
                                    //     { type: 'string', message: 'type error' },
                                    //     { validator: (rule, value) => value === 'semi', message: 'not semi' }
                                    // ]}
                                />
                            </div>
                            <div className="mb-3">
                                <Input                                
                                    field="phone"
                                    label={__("Phone", "mos-product-specifications-tab")}
                                    // trigger="blur"
                                    // className="mt-2"
                                    // rules={[
                                    //     { required: true, message: 'required Error' },
                                    //     { type: 'string', message: 'type error' },
                                    //     { validator: (rule, value) => value === 'semi', message: 'not semi' }
                                    // ]}
                                />
                            </div>
                            <div className="mb-3">
                                <TextArea
                                    field="message"
                                    label={__("Message", "mos-product-specifications-tab")}
                                    // className="mt-2"
                                    rules={[
                                        { required: true, message: __('This field is required', "mos-product-specifications-tab") },
                                        { type: 'string', message: __('Invalid type', "mos-product-specifications-tab") },
                                        // { validator: (rule, value) => value === 'semi', message: 'not semi' }
                                    ]}
                                />
                            </div>
                            <Space>
                                <Button theme="solid" type="primary" htmlType="submit" className="btn-margin-right">
                                    {__("Send", "mos-product-specifications-tab")}
                                </Button>
                                {/* <Button theme='solid' type='danger' htmlType="reset">{__("Reset", "mos-product-specifications-tab")}</Button> */}

                            </Space>
                            
                        </Form>
                        {/* <Button 
                            theme="solid"
                            type="primary"
                            icon={<IconSend />}
                            loading={processing} 
                            onClick={handleForm} 
                            style={{ marginRight: 14 }}
                        >                                
                            {
                                processing ? __( "Sending...", "mos-product-specifications-tab" ) : __( "Send", "mos-product-specifications-tab" )
                            }
                        </Button> */}
                        
                    </Col>  
                </Row>
            </Card>
        </BoxedLayout>
    );
};

export default Feedback;