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
    const settingsOld = useRef(null);

    const onSubmit = (values) => {
        handleSubmit('general', values);
    };

    const handleValuesChange = (values) => {
        if (settingsOld.current && settings.general) {
            const isChanged = JSON.stringify(values) !== JSON.stringify(settingsOld.current.general);
            setHasChanges(isChanged);
        }
    };

    useEffect(() => {
        if (settings && settings.general) {
            settingsOld.current = { ...settings };
            setHasChanges(false);
        }
    }, [settings]);

    return (
        <>
            {console.log(settings.general)}
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
                                    <Title heading={4}>{__("Group Title", "mos-product-specifications-tab")}</Title>
                                    <Paragraph>{__("Enable/Disable Group Title", "mos-product-specifications-tab")}</Paragraph>
                                </Skeleton>
                            </Col>    
                            {
                                !settingsLoading &&                               
                                <Col xs={24} lg={12} xl={10}>
                                    <Form.Switch 
                                        field='group_title'
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
                    </div>
                    <ActionButtons hasChanges={hasChanges} section='basic' handleReset={handleReset} />
                </Form>
            )}
        </>
    );
};

export default General;