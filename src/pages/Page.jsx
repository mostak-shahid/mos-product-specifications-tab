import { __ } from "@wordpress/i18n";

import { Row, Col, Select, Typography,  Input, Skeleton, Switch, Button } from '@douyinfe/semi-ui';
import React, {Suspense} from 'react';
import { BackgroundControl, BoxShadowControl, ColorPickerControl, FontControl, MediaUploaderControl, MultiColorControl, SkeletonPlaceholder, TextShadowControl, UnitControl } from '../components';
const units = [
    { value: 'px', label: 'px' },
    // { value: '%', label: '%' },
    // { value: 'em', label: 'em' },
    // { value: 'rem', label: 'rem' },
    // { value: 'vw', label: 'vw' },
];
const RemoteLoginForm = React.lazy(() => import("pluginstarterpro/LoginForm"));
const Page = () => {
    const settingLoading = false;
    const settingData = {};
    const { Title, Text, Paragraph } = Typography;
    return (
        <>
            {/* {console.log('settingData in tools page', settingData)} */}
            {/* <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingLoading} active>
                            <Title heading={4}>{__("Delete all the plugin data upon", "mos-product-specifications-tab")}</Title>
                            <Paragraph>{__("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, odio.", "mos-product-specifications-tab")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingLoading &&                               
                        <Col xs={24} lg={12} xl={10}>
                            <Select 
                                className="w-full"
                                placeholder={__("Action type", "mos-product-specifications-tab")} 
                                value={ settingData?.tools.delete_data_on }
                                //delete, unstall, none
                                optionList={ [
                                    { label: 'None', value: 'none' },
                                    { label: 'Delete', value: 'delete' },
                                    { label: 'Unstall', value: 'unstall' },
                                ] }
                                onChange={ ( changedValue ) => handleChange('tools.delete_data_on', changedValue ) }
                            />
                        </Col>
                    }
                </Row>
            </div>
            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingLoading} active>
                            <Title heading={4}>{__("BackgroundControl", "mos-product-specifications-tab")}</Title>
                            <Paragraph>{__("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, odio.", "mos-product-specifications-tab")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingLoading &&                               
                        <Col xs={24} lg={12} xl={10}>
                            <BackgroundControl
                                defaultValues={settingData?.page?.background}
                                name="page.background"
                                handleChange={handleChange}
                            />  
                        </Col>
                    }
                </Row>
            </div>
            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingLoading} active>
                            <Title heading={4}>{__("BoxShadowControl", "mos-product-specifications-tab")}</Title>
                            <Paragraph>{__("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, odio.", "mos-product-specifications-tab")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingLoading &&                               
                        <Col xs={24} lg={12} xl={10}>
                            <BoxShadowControl
                                value={settingData?.page?.boxshadow}
                                onChange={(value) => handleChange('page.boxshadow', value)}
                                // className="border-start border-end border-bottom"
                            />  
                        </Col>
                    }
                </Row>
            </div>
            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingLoading} active>
                            <Title heading={4}>{__("Color", "mos-product-specifications-tab")}</Title>
                            <Paragraph>{__("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, odio.", "mos-product-specifications-tab")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingLoading &&                               
                        <Col xs={24} lg={12} xl={10}>
                            <ColorPickerControl                                
                                defaultValue={settingData?.page?.color}
                                handleChange={(value) => handleChange('page.color', value)}
                                mode='color'
                                label={__("Color", "mos-product-specifications-tab")}
                            />  
                        </Col>
                    }
                </Row>
            </div>
            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingLoading} active>
                            <Title heading={4}>{__("Gradient", "mos-product-specifications-tab")}</Title>
                            <Paragraph>{__("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, odio.", "mos-product-specifications-tab")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingLoading &&                               
                        <Col xs={24} lg={12} xl={10}>
                            <ColorPickerControl                                
                                defaultValue={settingData?.page?.gradient}
                                handleChange={(value) => handleChange('page.gradient', value)}
                                mode='gradient'
                                label={__("Gradient", "mos-product-specifications-tab")}
                            />  
                        </Col>
                    }
                </Row>
            </div>
            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingLoading} active>
                            <Title heading={4}>{__("Color & Gradient", "mos-product-specifications-tab")}</Title>
                            <Paragraph>{__("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, odio.", "mos-product-specifications-tab")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingLoading &&                               
                        <Col xs={24} lg={12} xl={10}>
                            <ColorPickerControl                                
                                defaultValue={settingData?.page?.gradient}
                                handleChange={(value) => handleChange('page.gradient', value)}
                                mode='both'
                                label={__("Color & Gradient", "mos-product-specifications-tab")}
                            />  
                        </Col>
                    }
                </Row>
            </div>
            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingLoading} active>
                            <Title heading={4}>{__("FontControl", "mos-product-specifications-tab")}</Title>
                            <Paragraph>{__("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, odio.", "mos-product-specifications-tab")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingLoading &&                               
                        <Col xs={24} lg={12} xl={10}>
                            <FontControl 
                                defaultValues={settingData?.page?.font}
                                name='page.font' 
                                handleChange={handleChange}
                            />  
                        </Col>
                    }
                </Row>
            </div>
            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingLoading} active>
                            <Title heading={4}>{__("TextShadowControl", "mos-product-specifications-tab")}</Title>
                            <Paragraph>{__("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, odio.", "mos-product-specifications-tab")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingLoading &&                               
                        <Col xs={24} lg={12} xl={10}>
                            <TextShadowControl 
                                value={settingData?.page?.textshadow}
                                onChange={(value) => handleChange('page.textshadow', value)}/>  
                        </Col>
                    }
                </Row>
            </div>
            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingLoading} active>
                            <Title heading={4}>{__("MultiColorControl", "mos-product-specifications-tab")}</Title>
                            <Paragraph>{__("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, odio.", "mos-product-specifications-tab")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingLoading &&                               
                        <Col xs={24} lg={12} xl={10}>
                            <MultiColorControl 
                                options={['primary', 'secondary', 'tertiary']}
                                defaultValues={settingData?.page?.multicolor}
                                name='page.multicolor'
                                handleChange={handleChange}/>  
                        </Col>
                    }
                </Row>
            </div>
            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingLoading} active>
                            <Title heading={4}>{__("MediaUploaderControl", "mos-product-specifications-tab")}</Title>
                            <Paragraph>{__("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, odio.", "mos-product-specifications-tab")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingLoading &&                               
                        <Col xs={24} lg={12} xl={10}>
                            <MediaUploaderControl 
                                    data={settingData?.page?.media_uploader} 
                                    name={'page.media_uploader'}
                                    handleChange={handleChange}
                                    options = {{
                                        frame:{
                                            title: __("Select or Upload Image", "mos-product-specifications-tab"),
                                        },
                                        library: {type: 'image'},
                                        buttons: {
                                            upload: __("Upload Image", "mos-product-specifications-tab"),
                                            remove: __("Remove", "mos-product-specifications-tab"),
                                            select: __("Use this image", "mos-product-specifications-tab")                                            
                                        }
                                    }}
                                /> 
                        </Col>
                    }
                </Row>
            </div>
            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingLoading} active>
                            <Title heading={4}>{__("UnitControl", "mos-product-specifications-tab")}</Title>
                            <Paragraph>{__("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, odio.", "mos-product-specifications-tab")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingLoading &&                               
                        <Col xs={24} lg={12} xl={10}>                            
                            <UnitControl
                                label={__('UnitControl', 'mos-product-specifications-tab')}
                                onChange={(value) => handleChange('page.unitcontrol', value)}
                                value={settingData?.page?.unitcontrol}
                                units={units}
                                className="w-full"
                            />
                        </Col>
                    }
                </Row>
            </div> */}
            <p>The below item is from pro</p>
            {mos_product_specifications_tab_ajax_obj.isPro &&            
                <div className="setting-unit py-4">
                    <Row type="flex" gutter={[24, 24]}>
                        <Col xs={24} lg={12} xl={14}>
                            <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingLoading} active>
                                <Title heading={4}>{__("This is from pro", "mos-product-specifications-tab")}</Title>
                                <Paragraph>{__("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, odio.", "mos-product-specifications-tab")}</Paragraph>
                            </Skeleton>
                        </Col>    
                        {
                            !settingLoading &&                               
                            <Col xs={24} lg={12} xl={10}>
                                <Suspense fallback={<div>{__("Loading remote component...", "mos-product-specifications-tab")}</div>}>
                                    <RemoteLoginForm settingData={settingData} />
                                </Suspense>
                            </Col>
                        }
                    </Row>
                </div>                            
            }
            <p>The avobe item is from pro</p>
        </>
    )
}
export default Page; 