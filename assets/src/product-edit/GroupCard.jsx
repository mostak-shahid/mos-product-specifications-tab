import React, { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Card, Button, Input, Popconfirm, Space, Avatar, Tooltip, Row, Col, Typography, TextArea,  } from '@douyinfe/semi-ui';
import { IconPlus, IconMinus, IconChevronUp, IconChevronDown, IconCopy, IconDelete, IconCamera, IconHelpCircle } from '@douyinfe/semi-icons';
import SpecificationItem from './SpecificationItem';
const { Paragraph, Title, Text } = Typography;
export default function GroupCard({
    group,
    groupIndex,
    totalGroups,
    onUpdate,
    onRemove,
    onDuplicate,
    onMoveUp,
    onMoveDown,
    onAddSpecification,
    onUpdateSpecification,
    onRemoveSpecification,
    onDuplicateSpecification,
    onMoveSpecificationUp,
    onMoveSpecificationDown,
    onOpenImageUpload
}) {
    const [expanded, setExpanded] = useState(true);

    // Hover mask style for Avatar
    const hoverMaskStyle = {
        backgroundColor: 'var(--semi-color-overlay-bg)',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--semi-color-white)',
        cursor: 'pointer',
    };

    const hoverMask = (
        <div style={hoverMaskStyle}>
            <IconCamera />
        </div>
    );

    return (
        <div className="mos-spec-group-card">
            <Card
                title={
                    <div className="mos-spec-group-header">
                        <Space align="center" spacing="tight">
                            <div className="mos-spec-group-icon">
                                {/* WordPress Media Modal trigger */}
                                <Avatar
                                    src={group.group_icon?.url}
                                    style={{ margin: 4 }}
                                    hoverMask={hoverMask}
                                    onClick={() => onOpenImageUpload(groupIndex)}
                                />
                            </div>
                            <div className="mos-spec-group-heading">
                                <h3 className="mos-spec-group-title-heading">
                                    {group.group_title || __('Untitled Group', 'mos-product-specifications-tab')}
                                </h3>
                            </div>                                
                            {group.group_tooltip && (
                                <Tooltip content={group.group_tooltip}><IconHelpCircle /></Tooltip>
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
                            onClick={() => onMoveUp(groupIndex)}
                            disabled={groupIndex === 0}
                        />
                        <Button
                            type="tertiary"
                            theme="borderless"
                            icon={<IconChevronDown />}
                            onClick={() => onMoveDown(groupIndex)}
                            disabled={groupIndex === totalGroups - 1}
                        />
                        <Button
                            type="tertiary"
                            theme="borderless"
                            icon={<IconCopy />}
                            onClick={() => onDuplicate(groupIndex)}
                        />
                        <Popconfirm
                            title={__('Delete Group', 'mos-product-specifications-tab')}
                            content={__('Are you sure you want to delete this group?', 'mos-product-specifications-tab')}
                            onConfirm={() => onRemove(groupIndex)}
                            okText={__('Delete', 'mos-product-specifications-tab')}
                            cancelText={__('Cancel', 'mos-product-specifications-tab')}
                        >
                            <Button type="tertiary" theme="borderless" icon={<IconDelete />} />
                        </Popconfirm>
                        <Button
                            type="tertiary"
                            theme="borderless"
                            icon={expanded ? <IconMinus /> : <IconPlus />}
                            onClick={() => setExpanded(!expanded)}
                        />
                    </div>
                }
                className='mb-3'
                headerStyle={{ padding: '5px' }}
                bodyStyle={{padding: '0', marginBottom: '-1px'}}
            >
                
                {expanded && (
                    <div className="mos-spec-group-body">
                        <div className="mos-spec-group-inputs-wrapper">
                            <Row type="flex" gutter={12} className='p-3'>
                                <Col xs={24} lg={12}>
                                    <div className='flex flex-col'>
                                        <Text>{__("Group Title", "mos-product-specifications-tab")} <Text type="danger">*</Text></Text>
                                        <Input
                                            placeholder={__('Group Title', 'mos-product-specifications-tab')}
                                            value={group.group_title}
                                            onChange={(value) => onUpdate(groupIndex, 'group_title', value)}
                                            className="mos-spec-group-title-input"
                                            required={true}
                                        />                                    
                                    </div> 
                                </Col>                                 
                                <Col xs={24} lg={12}>
                                    <div className='flex flex-col'>
                                        <Text>{__("Group Tooltip", "mos-product-specifications-tab")}</Text>
                                        <Input
                                            placeholder={__('Group Tooltip', 'mos-product-specifications-tab')}
                                            value={group.group_tooltip}
                                            onChange={(value) => onUpdate(groupIndex, 'group_tooltip', value)}
                                            className="mos-spec-group-tooltip-input"
                                        />                                    
                                    </div> 
                                    
                                </Col>                     
                                <Col xs={24}>
                                    <div className='flex flex-col'>
                                        <Text>{__("Group Description", "mos-product-specifications-tab")}</Text>
                                        <TextArea
                                            placeholder={__('Group Description', 'mos-product-specifications-tab')}
                                            value={group.group_description}
                                            onChange={(value) => onUpdate(groupIndex, 'group_description', value)}
                                            className="mos-spec-group-description-input"
                                        />                                    
                                    </div> 
                                    
                                </Col>
                            </Row>
                        </div>
                            <>
                                <div className="mos-specifications-list">
                                    {group.specifications.map((spec, specIndex) => (
                                        <SpecificationItem
                                            key={specIndex}
                                            spec={spec}
                                            groupIndex={groupIndex}
                                            specIndex={specIndex}
                                            totalSpecs={group.specifications.length}
                                            onUpdate={onUpdateSpecification}
                                            onRemove={onRemoveSpecification}
                                            onDuplicate={onDuplicateSpecification}
                                            onMoveUp={onMoveSpecificationUp}
                                            onMoveDown={onMoveSpecificationDown}
                                        />
                                    ))}

                                    {group.specifications.length === 0 && (
                                        <div className="mos-spec-empty-list">
                                            <p>{__('No specifications in this group yet.', 'mos-product-specifications-tab')}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-3">
                                    <Button
                                        theme="light"
                                        type="secondary"
                                        onClick={() => onAddSpecification(groupIndex)}
                                        icon={<IconPlus />}
                                        className="mos-spec-add-spec-btn"
                                    >
                                        {__('Add Specification', 'mos-product-specifications-tab')}
                                    </Button>
                                </div>
                            </>
                    </div>
                )}
            </Card>
        </div>
    );
}
