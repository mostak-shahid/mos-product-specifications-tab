import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { Card, Button, Input, TextArea, Toast, Popover, Space, Typography, Icon } from '@douyinfe/semi-ui';
import { IconPlus, IconMinus, IconChevronUp, IconChevronDown, IconHelpCircle, IconCopy, IconDelete } from '@douyinfe/semi-icons';
import './index.scss';

const { Text } = Typography;
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
export default function ProductSpecificationsEdit() {
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState([]);
    const [productId, setProductId] = useState(null);

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

    const moveGroupUp = (groupIndex) => {
        if (groupIndex === 0) return;
        const updatedGroups = [...groups];
        [updatedGroups[groupIndex - 1], updatedGroups[groupIndex]] = [updatedGroups[groupIndex], updatedGroups[groupIndex - 1]];
        setGroups(updatedGroups);
    };

    const moveGroupDown = (groupIndex) => {
        if (groupIndex === groups.length - 1) return;
        const updatedGroups = [...groups];
        [updatedGroups[groupIndex], updatedGroups[groupIndex + 1]] = [updatedGroups[groupIndex + 1], updatedGroups[groupIndex]];
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

    const moveSpecificationUp = (groupIndex, specIndex) => {
        if (specIndex === 0) return;
        const updatedGroups = [...groups];
        const specs = updatedGroups[groupIndex].specifications;
        [specs[specIndex - 1], specs[specIndex]] = [specs[specIndex], specs[specIndex - 1]];
        setGroups(updatedGroups);
    };

    const moveSpecificationDown = (groupIndex, specIndex) => {
        const updatedGroups = [...groups];
        const specs = updatedGroups[groupIndex].specifications;
        if (specIndex === specs.length - 1) return;
        [specs[specIndex], specs[specIndex + 1]] = [specs[specIndex + 1], specs[specIndex]];
        setGroups(updatedGroups);
    };

    if (loading) {
        return <div className="mos-spec-loading">{__('Loading specifications...', 'mos-product-specifications-tab')}</div>;
    }

    return (
        <div className="mos-specifications-editor">
            <div className="mos-spec-header">
                <h3>{__('Product Specifications', 'mos-product-specifications-tab')}</h3>
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
                        totalGroups={groups.length}
                        onUpdate={updateGroup}
                        onRemove={removeGroup}
                        onDuplicate={duplicateGroup}
                        onMoveUp={moveGroupUp}
                        onMoveDown={moveGroupDown}
                        onAddSpecification={addSpecification}
                        onUpdateSpecification={updateSpecification}
                        onRemoveSpecification={removeSpecification}
                        onDuplicateSpecification={duplicateSpecification}
                        onMoveSpecificationUp={moveSpecificationUp}
                        onMoveSpecificationDown={moveSpecificationDown}
                    />
                ))}

                {/* {groups.length === 0 && (
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
                )} */}
            </div>
            <div>
                <Button
                    theme="solid"
                    type="primary"
                    onClick={addGroup}
                    icon={<IconPlus />}
                >
                    {__('Add Group', 'mos-product-specifications-tab')}
                </Button>
            </div>
        </div>
    );
}

function GroupCard({
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
    onMoveSpecificationDown
}) {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="mos-spec-group-card">
            <Card
                title={
                    <div className="mos-spec-group-header">
                        <div className="mos-spec-group-title-row">
                            <Space>
                                <div className="mos-spec-move-buttons">
                                    <Button
                                        type="tertiary"
                                        theme="borderless"
                                        icon={<IconChevronUp />}
                                        onClick={() => onMoveUp(groupIndex)}
                                        disabled={groupIndex === 0}
                                        className="mos-spec-move-up"
                                    />
                                    <Button
                                        type="tertiary"
                                        theme="borderless"
                                        icon={<IconChevronDown />}
                                        onClick={() => onMoveDown(groupIndex)}
                                        disabled={groupIndex === totalGroups - 1}
                                        className="mos-spec-move-down"
                                    />
                                </div>
                                <div className="mos-spec-action-buttons">
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
                                </div>
                            </Space>
                            <div className="input-group">
                                <Input
                                    placeholder={__('Group Title', 'mos-product-specifications-tab')}
                                    value={group.group_title}
                                    onChange={(value) => onUpdate(groupIndex, 'group_title', value)}
                                    className="mos-spec-group-title-input"
                                />
                                <Input
                                    placeholder={__('Group Tooltip', 'mos-product-specifications-tab')}
                                    value={group.group_tooltip}
                                    onChange={(value) => onUpdate(groupIndex, 'group_tooltip', value)}
                                    className="mos-spec-group-tooltip-input"
                                />
                                <TextArea
                                    placeholder={__('Group Description', 'mos-product-specifications-tab')}
                                    value={group.group_description}
                                    onChange={(value) => onUpdate(groupIndex, 'group_description', value)}
                                    rows={2}
                                    className="mos-spec-group-description"
                                />

                            </div>
                        </div>
                    </div>
                }
                headerExtraContent={<></>}
            >
                {expanded && (
                    <div className="mos-spec-group-body">

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
    totalSpecs,
    onUpdate,
    onRemove,
    onDuplicate,
    onMoveUp,
    onMoveDown
}) {
    return (
        <div className="mos-spec-item">
            <div className="mos-spec-item-header">
                <Space>
                    <div className="mos-spec-move-buttons">
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
                    </div>
                    <div className="mos-spec-action-buttons">
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
                    </div>
                </Space>
                <div className="input-group">
                    <Input
                        placeholder={__('Specification Title', 'mos-product-specifications-tab')}
                        value={spec.title}
                        onChange={(value) => onUpdate(groupIndex, specIndex, 'title', value)}
                        className="mos-spec-title-input"
                    />
                    <Input
                        placeholder={__('Specification Tooltip', 'mos-product-specifications-tab')}
                        value={spec.tooltip}
                        onChange={(value) => onUpdate(groupIndex, specIndex, 'tooltip', value)}
                        className="mos-spec-tooltip-input"
                    />                
                    <TextArea
                        placeholder={__('Description', 'mos-product-specifications-tab')}
                        value={spec.description}
                        onChange={(value) => onUpdate(groupIndex, specIndex, 'description', value)}
                        rows={2}
                        className="mos-spec-description"
                    />
                </div>
            </div>
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
