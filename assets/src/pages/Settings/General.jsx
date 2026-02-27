import { __ } from "@wordpress/i18n";
import { Form, Row, Col, Skeleton, Typography} from '@douyinfe/semi-ui';
import { useOutletContext } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import ActionButtons from "./ActionButtons";
import { SkeletonPlaceholder } from "../../components";

const { Title, Paragraph } = Typography;

const General = () => {
    const { settings, settingsLoading, handleSubmit, handleReset } = useOutletContext();
    const [hasChanges, setHasChanges] = useState(false);
    const [formValues, setFormValues] = useState({});
    const settingsOld = useRef(null);

    const onSubmit = (values) => {
        handleSubmit('general', values);
    };

    const handleValuesChange = (values) => {
        setFormValues(values);
        if (settingsOld.current && settings.general) {
            const isChanged = JSON.stringify(values) !== JSON.stringify(settingsOld.current.general);
            setHasChanges(isChanged);
        }
    };

    useEffect(() => {
        if (settings && settings.general) {
            settingsOld.current = { ...settings };
            setFormValues(settings.general);
            setHasChanges(false);
        }
    }, [settings]);

    return (
        <>
            {!settingsLoading && settings?.general && (
                <Form
                    initValues={settings.general}
                    onSubmit={onSubmit}
                    onValueChange={handleValuesChange}
                    labelPosition="left"
                    labelWidth="150px"
                >
                    <div className="setting-unit py-4">
                        <Row type="flex" gutter={[24, 24]}>
                            <Col xs={24} lg={12} xl={14}>
                                <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingsLoading} active>
                                    <Title heading={4}>{__("Enable", "mos-product-specifications-tab")}</Title>
                                    <Paragraph>{__("Enable/Disable Specific tabs functionalities", "mos-product-specifications-tab")}</Paragraph>
                                </Skeleton>
                            </Col>    
                            {
                                !settingsLoading &&                               
                                <Col xs={24} lg={12} xl={10}>
                                    <Form.Switch 
                                        field='enable'
                                        noLabel
                                    />   
                                </Col>
                            }
                        </Row>
                    </div>
                    <div className="setting-unit py-4">
                        <Row type="flex" gutter={[24, 24]}>
                            <Col xs={24} lg={12} xl={14}>
                                <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingsLoading} active>
                                    <Title heading={4}>{__("Table Intro", "mos-product-specifications-tab")}</Title>
                                    <Paragraph>{__("Enable/Disable Table Intro", "mos-product-specifications-tab")}</Paragraph>
                                </Skeleton>
                            </Col>    
                            {
                                !settingsLoading &&                               
                                <Col xs={24} lg={12} xl={10}>
                                    <Form.Switch 
                                        field='table_intro'
                                        noLabel
                                    />   
                                </Col>
                            }
                        </Row>
                    </div>

                    <div className="setting-unit py-4">
                        <Row type="flex" gutter={[24, 24]}>
                            <Col xs={24} lg={12} xl={14}>
                                <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingsLoading} active>
                                    <Title heading={4}>{__("Group Icon", "mos-product-specifications-tab")}</Title>
                                    <Paragraph>{__("Enable/Disable Group Icon", "mos-product-specifications-tab")}</Paragraph>
                                </Skeleton>
                            </Col>    
                            {
                                !settingsLoading &&                               
                                <Col xs={24} lg={12} xl={10}>
                                    <Form.Switch 
                                        field='group_icon'
                                        noLabel
                                    />   
                                </Col>
                            }
                        </Row>
                    </div>
                    <div className="setting-unit py-4">
                        <Row type="flex" gutter={[24, 24]}>
                            <Col xs={24} lg={12} xl={14}>
                                <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingsLoading} active>
                                    <Title heading={4}>{__("Group Tooltip", "mos-product-specifications-tab")}</Title>
                                    <Paragraph>{__("Enable/Disable Group Tooltip", "mos-product-specifications-tab")}</Paragraph>
                                </Skeleton>
                            </Col>    
                            {
                                !settingsLoading &&                               
                                <Col xs={24} lg={12} xl={10}>
                                    <Form.Switch 
                                        field='group_tooltip'
                                        noLabel
                                    />   
                                </Col>
                            }
                        </Row>
                    </div>
                    <div className="setting-unit py-4">
                        <Row type="flex" gutter={[24, 24]}>
                            <Col xs={24} lg={12} xl={14}>
                                <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingsLoading} active>
                                    <Title heading={4}>{__("Group Intro", "mos-product-specifications-tab")}</Title>
                                    <Paragraph>{__("Enable/Disable Group Intro", "mos-product-specifications-tab")}</Paragraph>
                                </Skeleton>
                            </Col>    
                            {
                                !settingsLoading &&                               
                                <Col xs={24} lg={12} xl={10}>
                                    <Form.Switch 
                                        field='group_intro'
                                        noLabel
                                    />   
                                </Col>
                            }
                        </Row>
                    </div>

                    <div className="setting-unit py-4">
                        <Row type="flex" gutter={[24, 24]}>
                            <Col xs={24} lg={12} xl={14}>
                                <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingsLoading} active>
                                    <Title heading={4}>{__("Specification Tooltip", "mos-product-specifications-tab")}</Title>
                                    <Paragraph>{__("Enable/Disable Specification Tooltip", "mos-product-specifications-tab")}</Paragraph>
                                </Skeleton>
                            </Col>    
                            {
                                !settingsLoading &&                               
                                <Col xs={24} lg={12} xl={10}>
                                    <Form.Switch 
                                        field='spec_tooltip'
                                        noLabel
                                    />   
                                </Col>
                            }
                        </Row>
                    </div>
                    {/* <div className="setting-unit py-4">
                        <Row type="flex" gutter={[24, 24]}>
                            <Col xs={24} lg={12} xl={14}>
                                <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingsLoading} active>
                                    <Title heading={4}>{__("Table Position", "mos-product-specifications-tab")}</Title>
                                    <Paragraph>{__("Select the position of the table", "mos-product-specifications-tab")}</Paragraph>
                                </Skeleton>
                            </Col>    
                            {
                                !settingsLoading &&                               
                                <Col xs={24} lg={12} xl={10}>
                                    <Form.Select 
                                        field="table_position"
                                        noLabel
                                        placeholder={__("Table Position", "mos-product-specifications-tab")}
                                        style={{ width: 180 }} 
                                        optionList={[
                                            { value: 'douyin', label: 'Douyin' },
                                            { value: 'capcut', label: 'Capcut' },
                                            { value: 'coze', label: 'Coze' },
                                            { value: 'toutiao', label: 'TooBuzz' },
                                        ]}
                                    />
                                </Col>
                            }
                        </Row>
                    </div> */}
                    <ActionButtons hasChanges={hasChanges} section='general' handleReset={handleReset} />
                </Form>
            )}
        </>
    );
};

export default General;