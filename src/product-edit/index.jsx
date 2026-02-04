import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { Card, Button, Input, TextArea, Toast, Popover, Space, Typography, Icon } from '@douyinfe/semi-ui';
import { IconPlus, IconMinus, IconSetting, IconHelpCircle, IconCopy, IconDelete } from '@douyinfe/semi-icons';
import './index.scss';
// Configure apiFetch with REST API settings
// WordPress automatically uses window.wpApiSettings if available
// Fallback to manual configuration if needed
if (typeof window.wpApiSettings === 'undefined' && typeof mos_product_specifications_tab_ajax_obj !== 'undefined') {
    window.wpApiSettings = {
        root: mos_product_specifications_tab_ajax_obj.root,
        nonce: mos_product_specifications_tab_ajax_obj.nonce
    };
}

// Ensure apiFetch uses the configured settings
if (typeof window.wpApiSettings !== 'undefined') {
    apiFetch.use(apiFetch.createRootURLMiddleware(window.wpApiSettings.root));
    apiFetch.use(apiFetch.createNonceMiddleware(window.wpApiSettings.nonce));
}
const { Text } = Typography;

export default function ProductSpecificationsEdit() {
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState([]);
    const [productId, setProductId] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);

    useEffect(() => {
        const productIdElement = document.querySelector('#post_ID');
        if (productIdElement) {
            const id = parseInt(productIdElement.value);
            setProductId(id);
            loadSpecifications(id);
        }
    }, []);

    useEffect(() => {
        if (groups.length >= 0 || loading === false) {
            const hiddenInput = document.getElementById('_mos_specifications_data');
            if (hiddenInput) {
                hiddenInput.value = JSON.stringify(groups);
            }
        }
    }, [groups, loading]);

    const loadSpecifications = async (id) => {
        try {
            const response = await apiFetch({
                path: `/mos-product-specifications-tab/v1/product/${id}/specifications`,
                method: 'GET',
            });
            const data = response.data || [];
            setGroups(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading specifications:', error);
            Toast.error({ content: __('Failed to load specifications', 'mos-product-specifications-tab') });
        } finally {
            setLoading(false);
        }
    };

    const addGroup = () => {
        const newGroup = {
            group_title: '',
            group_tooltip: '',
            group_description: '',
            group_icon: '',
            specifications: [],
        };
        setGroups([...groups, newGroup]);
    };

    const updateGroup = (groupIndex, field, value) => {
        const updatedGroups = [...groups];
        updatedGroups[groupIndex][field] = value;
        setGroups(updatedGroups);
    };

    const removeGroup = (groupIndex) => {
        const updatedGroups = groups.filter((_, index) => index !== groupIndex);
        setGroups(updatedGroups);
    };

    const duplicateGroup = (groupIndex) => {
        const updatedGroups = [...groups];
        const duplicatedGroup = JSON.parse(JSON.stringify(groups[groupIndex]));
        updatedGroups.splice(groupIndex + 1, 0, duplicatedGroup);
        setGroups(updatedGroups);
    };

    const addSpecification = (groupIndex) => {
        const newSpecification = {
            title: '',
            tooltip: '',
            description: '',
        };
        const updatedGroups = [...groups];
        updatedGroups[groupIndex].specifications.push(newSpecification);
        setGroups(updatedGroups);
    };

    const updateSpecification = (groupIndex, specIndex, field, value) => {
        const updatedGroups = [...groups];
        updatedGroups[groupIndex].specifications[specIndex][field] = value;
        setGroups(updatedGroups);
    };

    const removeSpecification = (groupIndex, specIndex) => {
        const updatedGroups = [...groups];
        updatedGroups[groupIndex].specifications = updatedGroups[groupIndex].specifications.filter(
            (_, index) => index !== specIndex
        );
        setGroups(updatedGroups);
    };

    const duplicateSpecification = (groupIndex, specIndex) => {
        const updatedGroups = [...groups];
        const duplicatedSpec = JSON.parse(JSON.stringify(updatedGroups[groupIndex].specifications[specIndex]));
        updatedGroups[groupIndex].specifications.splice(specIndex + 1, 0, duplicatedSpec);
        setGroups(updatedGroups);
    };

    const handleDragStart = (e, type, groupIndex, specIndex = null) => {
        setDraggedItem({ type, groupIndex, specIndex });
        e.dataTransfer.effectAllowed = 'move';
        e.target.style.opacity = '0.5';
    };

    const handleDragOver = (e, type, groupIndex, specIndex = null) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        setDraggedItem(null);
    };

    const handleDrop = (e, targetType, targetGroupIndex, targetSpecIndex = null) => {
        e.preventDefault();
        e.stopPropagation();

        if (!draggedItem) return;

        const { type: sourceType, groupIndex: sourceGroupIndex, specIndex: sourceSpecIndex } = draggedItem;

        if (sourceType === 'group' && targetType === 'group') {
            if (sourceGroupIndex === targetGroupIndex) return;

            const updatedGroups = [...groups];
            const [movedGroup] = updatedGroups.splice(sourceGroupIndex, 1);
            updatedGroups.splice(targetGroupIndex, 0, movedGroup);
            setGroups(updatedGroups);
        } else if (sourceType === 'specification' && targetType === 'specification' && sourceGroupIndex === targetGroupIndex) {
            if (sourceSpecIndex === targetSpecIndex) return;

            const updatedGroups = [...groups];
            const specs = updatedGroups[targetGroupIndex].specifications;
            const [movedSpec] = specs.splice(sourceSpecIndex, 1);
            specs.splice(targetSpecIndex, 0, movedSpec);
            setGroups(updatedGroups);
        }

        setDraggedItem(null);
    };

    if (loading) {
        return <div className="mos-spec-loading">{__('Loading specifications...', 'mos-product-specifications-tab')}</div>;
    }

    return (
        <div className="mos-specifications-editor">
            <div className="mos-spec-header">
                <h3>{__('Product Specifications', 'mos-product-specifications-tab')}</h3>
                <Button
                    theme="solid"
                    type="primary"
                    onClick={addGroup}
                    icon={<IconPlus />}
                >
                    {__('Add Group', 'mos-product-specifications-tab')}
                </Button>
            </div>

            <input
                type="hidden"
                id="_mos_specifications_data"
                name="_mos_specifications_data"
                value={JSON.stringify(groups)}
                readOnly
            />

            <div className="mos-spec-groups">
                {groups.map((group, groupIndex) => (
                    <GroupCard
                        key={groupIndex}
                        group={group}
                        groupIndex={groupIndex}
                        onUpdate={updateGroup}
                        onRemove={removeGroup}
                        onDuplicate={duplicateGroup}
                        onAddSpecification={addSpecification}
                        onUpdateSpecification={updateSpecification}
                        onRemoveSpecification={removeSpecification}
                        onDuplicateSpecification={duplicateSpecification}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                        onDrop={handleDrop}
                        draggedItem={draggedItem}
                    />
                ))}

                {groups.length === 0 && (
                    <div className="mos-spec-empty">
                        <p>{__('No specifications yet. Add a group to get started.', 'mos-product-specifications-tab')}</p>
                        <Button
                            theme="solid"
                            type="primary"
                            onClick={addGroup}
                            icon={<IconPlus />}
                        >
                            {__('Add First Group', 'mos-product-specifications-tab')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

function GroupCard({
    group,
    groupIndex,
    onUpdate,
    onRemove,
    onDuplicate,
    onAddSpecification,
    onUpdateSpecification,
    onRemoveSpecification,
    onDuplicateSpecification,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDrop,
    draggedItem
}) {
    const [expanded, setExpanded] = useState(true);

    return (
        <div
            className={`mos-spec-group-card ${draggedItem?.type === 'group' && draggedItem.groupIndex === groupIndex ? 'dragging' : ''}`}
            draggable
            onDragStart={(e) => onDragStart(e, 'group', groupIndex)}
            onDragOver={(e) => onDragOver(e, 'group', groupIndex)}
            onDragEnd={onDragEnd}
            onDrop={(e) => onDrop(e, 'group', groupIndex)}
        >
            <Card
                title={
                    <div className="mos-spec-group-header">
                        <div className="mos-spec-group-title-row">
                            <IconSetting className="mos-spec-drag-handle" />
                            <Input
                                placeholder={__('Group Title', 'mos-product-specifications-tab')}
                                value={group.group_title}
                                onChange={(value) => onUpdate(groupIndex, 'group_title', value)}
                                className="mos-spec-group-title-input"
                            />
                            <TooltipInput
                                value={group.group_tooltip}
                                onChange={(value) => onUpdate(groupIndex, 'group_tooltip', value)}
                                placeholder={__('Group Tooltip', 'mos-product-specifications-tab')}
                            />
                        </div>
                        <Space>
                            <Button
                                type="tertiary"
                                theme="borderless"
                                icon={<IconCopy />}
                                onClick={() => onDuplicate(groupIndex)}
                            />
                            <Button
                                type="tertiary"
                                theme="borderless"
                                icon={<IconDelete />}
                                onClick={() => onRemove(groupIndex)}
                            />
                            <Button
                                type="tertiary"
                                theme="borderless"
                                icon={expanded ? <IconMinus /> : <IconPlus />}
                                onClick={() => setExpanded(!expanded)}
                            />
                        </Space>
                    </div>
                }
                headerExtraContent={<></>}
            >
                {expanded && (
                    <div className="mos-spec-group-body">
                        <TextArea
                            placeholder={__('Group Description', 'mos-product-specifications-tab')}
                            value={group.group_description}
                            onChange={(value) => onUpdate(groupIndex, 'group_description', value)}
                            rows={2}
                            className="mos-spec-group-description"
                        />

                        <div className="mos-specifications-list">
                            {group.specifications.map((spec, specIndex) => (
                                <SpecificationItem
                                    key={specIndex}
                                    spec={spec}
                                    groupIndex={groupIndex}
                                    specIndex={specIndex}
                                    onUpdate={onUpdateSpecification}
                                    onRemove={onRemoveSpecification}
                                    onDuplicate={onDuplicateSpecification}
                                    onDragStart={onDragStart}
                                    onDragOver={onDragOver}
                                    onDragEnd={onDragEnd}
                                    onDrop={onDrop}
                                    draggedItem={draggedItem}
                                />
                            ))}

                            {group.specifications.length === 0 && (
                                <div className="mos-spec-empty-list">
                                    <p>{__('No specifications in this group yet.', 'mos-product-specifications-tab')}</p>
                                </div>
                            )}
                        </div>

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
                )}
            </Card>
        </div>
    );
}

function SpecificationItem({
    spec,
    groupIndex,
    specIndex,
    onUpdate,
    onRemove,
    onDuplicate,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDrop,
    draggedItem
}) {
    return (
        <div
            className={`mos-spec-item ${draggedItem?.type === 'specification' && draggedItem.groupIndex === groupIndex && draggedItem.specIndex === specIndex ? 'dragging' : ''}`}
            draggable
            onDragStart={(e) => onDragStart(e, 'specification', groupIndex, specIndex)}
            onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            onDragEnd={onDragEnd}
            onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDrop(e, 'specification', groupIndex, specIndex);
            }}
        >
            <div className="mos-spec-item-header">
                <IconSetting className="mos-spec-drag-handle" />
                <Input
                    placeholder={__('Specification Title', 'mos-product-specifications-tab')}
                    value={spec.title}
                    onChange={(value) => onUpdate(groupIndex, specIndex, 'title', value)}
                    className="mos-spec-title-input"
                />
                <TooltipInput
                    value={spec.tooltip}
                    onChange={(value) => onUpdate(groupIndex, specIndex, 'tooltip', value)}
                    placeholder={__('Tooltip', 'mos-product-specifications-tab')}
                />
                <Space>
                    <Button
                        type="tertiary"
                        theme="borderless"
                        icon={<IconCopy />}
                        onClick={() => onDuplicate(groupIndex, specIndex)}
                    />
                    <Button
                        type="tertiary"
                        theme="borderless"
                        icon={<IconDelete />}
                        onClick={() => onRemove(groupIndex, specIndex)}
                    />
                </Space>
            </div>
            <TextArea
                placeholder={__('Description', 'mos-product-specifications-tab')}
                value={spec.description}
                onChange={(value) => onUpdate(groupIndex, specIndex, 'description', value)}
                rows={2}
                className="mos-spec-description"
            />
        </div>
    );
}

function TooltipInput({ value, onChange, placeholder }) {
    const [showPopover, setShowPopover] = useState(false);

    return (
        <Popover
            visible={showPopover}
            onVisibleChange={setShowPopover}
            trigger="click"
            position="bottomLeft"
            showArrow
            content={
                <div style={{ padding: '8px', minWidth: '250px' }}>
                    <TextArea
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        rows={3}
                        autoFocus
                    />
                </div>
            }
        >
            <Button
                type="tertiary"
                theme="borderless"
                icon={<IconHelpCircle />}
                className={`mos-spec-tooltip-btn ${value ? 'has-value' : ''}`}
            >
                {value && <span className="tooltip-indicator">•</span>}
            </Button>
        </Popover>
    );
}

const rootElement = document.getElementById('mos-product-specifications-tab-groups');

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<ProductSpecificationsEdit />);
}
