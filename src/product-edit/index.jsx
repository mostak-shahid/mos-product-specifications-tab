import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { Button, Toast,  } from '@douyinfe/semi-ui';
import { IconPlus,} from '@douyinfe/semi-icons';
import GroupCard from './GroupCard';
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

export default function ProductSpecificationsEdit() {
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState([]);
    const [productId, setProductId] = useState(null);
    const [imageUploadModal, setImageUploadModal] = useState({ visible: false, groupIndex: null });
    const [mediaUploaderOpen, setMediaUploaderOpen] = useState(false);

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
    useEffect(() => {
        if (imageUploadModal.visible && typeof wp !== 'undefined' && wp.media) {
            let frame;
            const openMediaUploader = () => {
                if (frame) {
                    frame.open();
                    return;
                }

                frame = wp.media({
                    title: __('Select or Upload Image', 'mos-product-specifications-tab'),
                    button: {
                        text: __('Use This Image', 'mos-product-specifications-tab'),
                    },
                    multiple: false,
                    library: { type: 'image' },
                });

                frame.on('select', function() {
                    const attachment = frame.state().get('selection').first().toJSON();
                    handleImageSelect(attachment);
                    frame.close();
                });

                frame.open();
            };

            openMediaUploader();
        }
    }, [imageUploadModal]);

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

    const openImageUpload = (groupIndex) => {
        setImageUploadModal({ visible: true, groupIndex });
        setMediaUploaderOpen(true);
    };

    const closeImageUpload = () => {
        setImageUploadModal({ visible: false, groupIndex: null });
        setMediaUploaderOpen(false);
    };

    const handleImageSelect = (attachment) => {
        const { groupIndex } = imageUploadModal;
        if (groupIndex !== null) {
            const imageUrl = attachment.url || attachment.sizes?.full?.url || attachment.sizes?.thumbnail?.url;
            updateGroup(groupIndex, 'group_icon', {
                id: attachment.id,
                url: imageUrl,
            });
        }
        closeImageUpload();
    };

    const removeGroup = (groupIndex) => {
        const updatedGroups = groups.filter((_, index) => index !== groupIndex);
        setGroups(updatedGroups);
        Toast.success({ content: __('Group deleted', 'mos-product-specifications-tab') });
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
        Toast.success({ content: __('Specification deleted', 'mos-product-specifications-tab') });
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
        <div className="mos-specifications-editor p-4">
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
                        onOpenImageUpload={openImageUpload}
                    />
                ))}
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





const rootElement = document.getElementById('mos-product-specifications-tab-groups');

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<ProductSpecificationsEdit />);
}