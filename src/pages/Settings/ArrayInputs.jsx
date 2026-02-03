import { __ } from "@wordpress/i18n";
import { Form, Button, Row, Col, Skeleton, Typography, ArrayField, } from '@douyinfe/semi-ui';
import { IconPlusCircle, IconMinusCircle } from '@douyinfe/semi-icons';
import { useOutletContext } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import ActionButtons from "./ActionButtons";
import { SkeletonPlaceholder } from "../../components";
const { Title, Paragraph } = Typography;
const ArrayInputs = () => {
    const { settings, settingsLoading, handleSubmit, handleReset } = useOutletContext();
    const [hasChanges, setHasChanges] = useState(false);
    const settingsOld = useRef(null);

    const onSubmit = (values) => {
        handleSubmit('array', values);
    };

    const handleValuesChange = (values) => {
        if (settingsOld.current && settings.array) {
            const isChanged = JSON.stringify(values) !== JSON.stringify(settingsOld.current.array);
            setHasChanges(isChanged);
        }
    };

    useEffect(() => {
        if (settings && settings.array) {
            settingsOld.current = { ...settings };
            setHasChanges(false);
        }
    }, [settings]);

    const [data] = useState([
        { name: 'Semi D2C', role: 'Engineer' },
        { name: 'Semi C2D', role: 'Designer' },
    ]);

    return (
        <>
            {!settingsLoading && settings?.array && (
                <Form
                    initValues={settings.array}
                    onSubmit={onSubmit}
                    onValueChange={handleValuesChange}
                    style={{ maxWidth: '600px' }}
                    labelPosition="left"
                >

                    <div className="setting-unit py-4">
                        <Row type="flex" gutter={[24, 24]}>
                            <Col xs={24} lg={12} xl={14}>
                                <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingsLoading} active>
                                    <Title heading={4}>{__("Checkbox Group", "mos-product-specifications-tab")}</Title>
                                    <Paragraph>{__("Lorem", "mos-product-specifications-tab")}</Paragraph>
                                </Skeleton>
                            </Col>    
                            {
                                !settingsLoading &&                               
                                <Col xs={24} lg={12} xl={10}>
                                    <Form.CheckboxGroup field="checkbox" noLabel direction="vertical">
                                        <Form.Checkbox value="checkbox-1">{__('Checkbox 1', 'mos-product-specifications-tab')}</Form.Checkbox>
                                        <Form.Checkbox value="checkbox-2">{__('Checkbox 2', 'mos-product-specifications-tab')}</Form.Checkbox>
                                        <Form.Checkbox value="checkbox-3">{__('Checkbox 3', 'mos-product-specifications-tab')}</Form.Checkbox>
                                        <Form.Checkbox value="checkbox-4">{__('Checkbox 4', 'mos-product-specifications-tab')}</Form.Checkbox>
                                    </Form.CheckboxGroup>
                                </Col>
                            }
                        </Row>
                    </div>

                    <ArrayField field="rules" initValue={data}>
                        {({ add, arrayFields, addWithInitValue }) => (
                            <>
                                <Button
                                    onClick={add}
                                    icon={<IconPlusCircle />}
                                    theme="light"
                                >
                                    Add new line
                                </Button>

                                <Button
                                    icon={<IconPlusCircle />}
                                    onClick={() =>
                                        addWithInitValue({
                                            name: 'Semi DSM',
                                            role: 'Designer',
                                        })
                                    }
                                    style={{ marginLeft: 8 }}
                                >
                                    Add new line with init value
                                </Button>

                                {arrayFields.map(({ field, key, remove }) => (
                                    <div
                                        key={key}
                                        style={{ width: 1000, display: 'flex' }}
                                    >
                                        <Form.Input
                                            field={`${field}[name]`}
                                            label={`${field}.name`}
                                            style={{ width: 200, marginRight: 16 }}
                                        />

                                        <Form.Select
                                            field={`${field}[role]`}
                                            label={`${field}.role`}
                                            style={{ width: 120 }}
                                            optionList={[
                                                { label: 'Engineer', value: 'Engineer' },
                                                { label: 'Designer', value: 'Designer' },
                                            ]}
                                        />

                                        <Button
                                            type="danger"
                                            theme="borderless"
                                            icon={<IconMinusCircle />}
                                            onClick={remove}
                                            style={{ margin: 12 }}
                                        />
                                    </div>
                                ))}
                            </>
                        )}
                    </ArrayField>
                    
                    <ActionButtons hasChanges={hasChanges} section='array' handleReset={handleReset} />
                </Form>
            )}
        </>
    );
};

export default ArrayInputs;