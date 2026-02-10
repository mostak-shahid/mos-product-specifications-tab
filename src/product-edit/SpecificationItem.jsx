import React, { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Button, Input, TextArea, Space, Popconfirm, Card, Tooltip, Row, Col, Typography } from '@douyinfe/semi-ui';
import { IconPlus, IconMinus, IconChevronUp, IconChevronDown, IconCopy, IconDelete, IconHelpCircle } from '@douyinfe/semi-icons';

const { Paragraph, Title, Text } = Typography;

export default function SpecificationItem({
    spec,
    groupIndex,
    specIndex,
    totalSpecs,
    onUpdate,
    onRemove,
    onDuplicate,
    onMoveUp,
    onMoveDown
}) {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="mos-spec-item mb-2 px-3">
            <Card
                title={
                    <div className="mos-spec-group-header">
                        <Space align="center" spacing="tight">
                            <div className="mos-spec-group-heading">
                                <h4 className="mos-spec-group-title-heading" style={{margin: 0}}>
                                    {spec.title || __('Untitled Specification', 'mos-product-specifications-tab')}
                                </h4>
                            </div>                                
                            {spec.tooltip && (
                                <Tooltip content={spec.tooltip}><IconHelpCircle /></Tooltip>
                            )}
                        </Space>
                    </div>
                }
                headerExtraContent={
                    <div className="mos-spec-move-buttons-header">
                        <Button
                        type="tertiary"
                        theme="borderless"
                        icon={<IconChevronUp />}
                        onClick={() => onMoveUp(groupIndex, specIndex)}
                        disabled={specIndex === 0}
                            className="mos-spec-move-up"
                        />
                        <Button
                            type="tertiary"
                            theme="borderless"
                            icon={<IconChevronDown />}
                            onClick={() => onMoveDown(groupIndex, specIndex)}
                            disabled={specIndex === totalSpecs - 1}
                            className="mos-spec-move-down"
                        />

                        <Button
                            type="tertiary"
                            theme="borderless"
                            icon={<IconCopy />}
                            onClick={() => onDuplicate(groupIndex, specIndex)}
                        />
                        <Popconfirm
                            title={__('Delete Specification', 'mos-product-specifications-tab')}
                            content={__('Are you sure you want to delete this specification?', 'mos-product-specifications-tab')}
                            onConfirm={() => onRemove(groupIndex, specIndex)}
                            okText={__('Delete', 'mos-product-specifications-tab')}
                            cancelText={__('Cancel', 'mos-product-specifications-tab')}
                        >
                            <Button
                                type="tertiary"
                                theme="borderless"
                                icon={<IconDelete />}
                            />
                        </Popconfirm>
                        <Button
                            type="tertiary"
                            theme="borderless"
                            icon={expanded ? <IconMinus /> : <IconPlus />}
                            onClick={() => setExpanded(!expanded)}
                            className="mos-spec-toggle-btn"
                        />
                    </div>
                }
                headerStyle={{ padding: '0.75rem' }}
                bodyStyle={{padding: '0', marginBottom: '-1px'}}
            >

                {expanded && (
                    <>
                        <Row type="flex" gutter={12} className='p-3'>
                            <Col xs={24} lg={12}>
                                <div className='flex flex-col'>
                                    <Text>{__("Title", "mos-product-specifications-tab")} <Text type="danger">*</Text></Text>
                                    <Input
                                        placeholder={__('Title', 'mos-product-specifications-tab')}
                                        value={spec.title}
                                        onChange={(value) => onUpdate(groupIndex, specIndex, 'title', value)}
                                        className="mos-spec-title"
                                        required={true}
                                    />                                    
                                </div>      
                            </Col>                                 
                            <Col xs={24} lg={12}>
                                <div className='flex flex-col'>
                                    <Text>{__("Tooltip", "mos-product-specifications-tab")}</Text>
                                    <Input
                                        placeholder={__('Tooltip', 'mos-product-specifications-tab')}
                                        value={spec.tooltip}
                                        onChange={(value) => onUpdate(groupIndex, specIndex, 'tooltip', value)}
                                        className="mos-spec-tooltip"
                                    />                                    
                                </div>  
                            </Col>                               
                            <Col xs={24}>
                                <div className='flex flex-col'>
                                    <Text>{__("Description", "mos-product-specifications-tab")} <Text type="danger">*</Text></Text>
                                    <TextArea
                                        placeholder={__('Description', 'mos-product-specifications-tab')}
                                        value={spec.description}
                                        onChange={(value) => onUpdate(groupIndex, specIndex, 'description', value)}
                                        className="mos-spec-description"
                                        required={true}
                                    />                                    
                                </div>  
                            </Col>
                        </Row>
                    </>
                )}
            </Card>
        </div>
    );
}
