package com.helloshoes.shoeshopmanagement.service.impl;

import com.helloshoes.shoeshopmanagement.dto.ItemColourDTO;
import com.helloshoes.shoeshopmanagement.dto.ItemDTO;
import com.helloshoes.shoeshopmanagement.dto.ItemSizeDTO;
import com.helloshoes.shoeshopmanagement.entity.*;
import com.helloshoes.shoeshopmanagement.repository.*;
import com.helloshoes.shoeshopmanagement.service.ItemService;
import com.helloshoes.shoeshopmanagement.util.IDGeneratorUtil;
import com.helloshoes.shoeshopmanagement.util.IdType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {
    private final ItemRepository itemRepository;
    private final SizeRepository sizeRepository;
    private final SupplierRepository supplierRepository;
    private final CategoryRepository categoryRepository;
    private final TypeRepository typeRepository;
    private final ColourRepository colourRepository;
    private final ItemSizeRepository itemSizeRepository;
    private final ItemColourRepository itemColourRepository;
    private final ItemDetailsRepository itemDetailsRepository;

    @Override
    public ItemDTO save(ItemDTO dto) {
        Item item = new Item();
        item.setItemCode(dto.getItemCode());
        item.setItemName(dto.getItemName());
        item.setExpectedProfit(dto.getExpectedProfit());
        item.setProfitMargin(dto.getProfitMargin());
        item.setShoeGender(dto.getGender());

        Supplier supplier = supplierRepository.findBySupplierName(dto.getSupplierName());
        List<Supplier> supplierList = new ArrayList<>();
        supplierList.add(supplier);
        item.setSuppliers(supplierList);

        Category category = categoryRepository.findByName(dto.getCategoryName());
        List<Category> categoryList = new ArrayList<>();
        categoryList.add(category);
        item.setCategories(categoryList);

        Type type = typeRepository.findByTypeName(dto.getTypeName());
        List<Type> typeList = new ArrayList<>();
        typeList.add(type);
        item.setTypes(typeList);

        itemRepository.save(item);

        for (ItemColourDTO itemColourDTO : dto.getColours()) {
            Colour colour = colourRepository.findByName(itemColourDTO.getColourName());
            ItemColour itemColour = new ItemColour();
            itemColour.setId(IDGeneratorUtil.idGenerator(IdType.ITEM_COLOUR));
            itemColour.setImgPath(itemColourDTO.getImage());
            itemColour.setSellPrice(itemColourDTO.getSellPrice());
            itemColour.setBuyPrice(itemColourDTO.getBuyPrice());
            itemColour.setItem(item);
            itemColour.setColour(colour);
            itemColourRepository.save(itemColour);
            for (ItemSizeDTO itemSizeDTO : itemColourDTO.getSizes()) {
                Size size = sizeRepository.findBySize(itemSizeDTO.getSize());
                ItemSize itemSize = new ItemSize();
                itemSize.setId(IDGeneratorUtil.idGenerator(IdType.ITEM_SIZE));
                itemSize.setQty(itemSizeDTO.getQuantity());
                itemSize.setItem(item);
                itemSize.setSize(size);
                itemSize.setColour(colour);
                itemSizeRepository.save(itemSize);

                ItemDetails itemDetails = new ItemDetails();
                itemDetails.setId(IDGeneratorUtil.idGenerator(IdType.ITEM_DETAILS));
                itemDetails.setItem(item);
                itemDetails.setColour(colour);
                itemDetails.setType(type);
                itemDetails.setCategory(category);
                itemDetails.setSize(size);
                itemDetails.setQty(itemSizeDTO.getQuantity());
                itemDetailsRepository.save(itemDetails);
            }
        }
        return null;
    }

    @Override
    public Boolean delete(String code) {
        return null;
    }

    @Override
    public ItemDTO getByCode(String code) {
        if (!itemRepository.existsById(code)) {
            return null;
        }
        Item item = itemRepository.getReferenceById(code);
        return convertItemToItemDTO(item);
    }

    @Override
    public List<ItemDTO> getAll() {
        List<Item> items = itemRepository.findAll();
        List<ItemDTO> itemDTOS = new ArrayList<>();
        for (Item item : items) {
            ItemDTO itemDTO = convertItemToItemDTO(item);
            itemDTOS.add(itemDTO);
        }
        return itemDTOS;
    }

    @Override
    public List<ItemDTO> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Item> items = itemRepository.findAll(pageable);
        List<ItemDTO> itemDTOS = new ArrayList<>();
        for (Item item : items) {
            ItemDTO itemDTO = convertItemToItemDTO(item);
            itemDTOS.add(itemDTO);
        }
        return itemDTOS;
    }

    @Override
    public int getItemCount() {
        return (int) itemRepository.count();
    }

    @Override
    public String getNextItemCode() {
        String nextCode = itemRepository.findNextItemCode();
        if (nextCode == null) {
            return "IC001";
        }
        int code = Integer.parseInt(nextCode.substring(3)) + 1;
        return "IC" + String.format("%03d", code);
    }

    @Override
    public List<ItemDTO> getSearchItems(String query) {
        List<Item> items = itemRepository.searchItems(query);
        List<ItemDTO> itemDTOS = new ArrayList<>();
        for (Item item : items) {
            ItemDTO itemDTO = convertItemToItemDTO(item);
            itemDTOS.add(itemDTO);
        }
        return itemDTOS;
    }

    @Override
    public Page<ItemDTO> searchItems(String query, String type, String category, String supplier, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Item> items = itemRepository.searchItems(query, type, category, supplier, pageable);
        return items.map(this::convertItemToItemDTO);
    }

    @Override
    public Boolean update(String itemCode, ItemDTO dto) {
        Optional<Item> existingItemOptional = itemRepository.findById(itemCode);
        if (existingItemOptional.isPresent()) {
            Item existingItem = existingItemOptional.get();

            // Update basic item details
            existingItem.setItemName(dto.getItemName());
            existingItem.setExpectedProfit(dto.getExpectedProfit());
            existingItem.setProfitMargin(dto.getProfitMargin());
            existingItem.setShoeGender(dto.getGender());

            // Update suppliers
            List<Supplier> suppliers = new ArrayList<>();
            Supplier supplier = supplierRepository.findBySupplierName(dto.getSupplierName());
            if (supplier != null) {
                suppliers.add(supplier);
            }
            existingItem.setSuppliers(suppliers);

            // Update categories
            List<Category> categories = new ArrayList<>();
            Category category = categoryRepository.findByName(dto.getCategoryName());
            if (category != null) {
                categories.add(category);
            }
            existingItem.setCategories(categories);

            // Update types
            List<Type> types = new ArrayList<>();
            Type type = typeRepository.findByTypeName(dto.getTypeName());
            if (type != null) {
                types.add(type);
            }
            existingItem.setTypes(types);

            // Update colors and sizes
            List<ItemColour> existingColors = itemColourRepository.findByItem_ItemCode(itemCode);
            Map<String, ItemColourDTO> newColorsMap = new HashMap<>();
            for (ItemColourDTO color : dto.getColours()) {
                newColorsMap.put(color.getColourName(), color);
            }

            // Remove colors not in the update data
            for (ItemColour existingColor : existingColors) {
                if (!newColorsMap.containsKey(existingColor.getColour().getColourName())) {
                    itemColourRepository.delete(existingColor);
                    itemSizeRepository.deleteAllByItemAndColour(existingItem, existingColor.getColour());
                    itemDetailsRepository.deleteAllByItemAndColour(existingItem, existingColor.getColour());
                }
            }

            for (ItemColourDTO itemColourDTO : dto.getColours()) {
                Colour colour = colourRepository.findByName(itemColourDTO.getColourName());
                ItemColour itemColour = itemColourRepository.findByItemAndColour(existingItem, colour)
                        .orElseGet(() -> {
                            ItemColour newItemColour = new ItemColour();
                            newItemColour.setId(IDGeneratorUtil.idGenerator(IdType.ITEM_COLOUR));
                            newItemColour.setItem(existingItem);
                            newItemColour.setColour(colour);
                            return newItemColour;
                        });

                itemColour.setImgPath(itemColourDTO.getImage());
                itemColour.setSellPrice(itemColourDTO.getSellPrice());
                itemColour.setBuyPrice(itemColourDTO.getBuyPrice());
                itemColourRepository.save(itemColour);

                // Update sizes
                List<ItemSize> existingSizes = itemSizeRepository.findByItemAndColour(existingItem, colour);
                Map<Integer, ItemSizeDTO> newSizeMap = new HashMap<>();
                for (ItemSizeDTO size : itemColourDTO.getSizes()) {
                    newSizeMap.put(size.getSize(), size);
                }

                // Remove sizes not in the update data
                for (ItemSize existingSize : existingSizes) {
                    if (!newSizeMap.containsKey(existingSize.getSize().getSize())) {
                        itemSizeRepository.delete(existingSize);
                    }
                }

                // Keep track of ItemDetails that need to be updated
                Set<String> updatedItemDetailsIds = new HashSet<>();

                for (ItemSizeDTO itemSizeDTO : itemColourDTO.getSizes()) {
                    Size size = sizeRepository.findBySize(itemSizeDTO.getSize());
                    ItemSize itemSize = itemSizeRepository.findByItemAndColourAndSize(existingItem, colour, size)
                            .orElseGet(() -> {
                                ItemSize newItemSize = new ItemSize();
                                newItemSize.setId(IDGeneratorUtil.idGenerator(IdType.ITEM_SIZE));
                                newItemSize.setItem(existingItem);
                                newItemSize.setColour(colour);
                                newItemSize.setSize(size);
                                return newItemSize;
                            });

                    itemSize.setQty(itemSizeDTO.getQuantity());
                    itemSizeRepository.save(itemSize);

                    // Update item details
                    ItemDetails itemDetails = itemDetailsRepository.findByItemAndColourAndSize(existingItem, colour, size)
                            .orElseGet(() -> {
                                ItemDetails newItemDetails = new ItemDetails();
                                newItemDetails.setId(IDGeneratorUtil.idGenerator(IdType.ITEM_DETAILS));
                                newItemDetails.setItem(existingItem);
                                newItemDetails.setColour(colour);
                                newItemDetails.setSize(size);
                                newItemDetails.setCategory(category);
                                newItemDetails.setType(type);
                                return newItemDetails;
                            });

                    itemDetails.setQty(itemSizeDTO.getQuantity());
                    itemDetailsRepository.save(itemDetails);
                    updatedItemDetailsIds.add(itemDetails.getId());
                }

                // Remove ItemDetails not in the update data
                List<ItemDetails> existingItemDetails = itemDetailsRepository.findByItemAndColour(existingItem, colour);
                for (ItemDetails existingDetail : existingItemDetails) {
                    if (!updatedItemDetailsIds.contains(existingDetail.getId())) {
                        itemDetailsRepository.delete(existingDetail);
                    }
                }
            }
            itemRepository.save(existingItem);
            return true;
        }
        return false;
    }

    private ItemDTO convertItemToItemDTO(Item item) {
        ItemDTO itemDTO = new ItemDTO();

        itemDTO.setItemCode(item.getItemCode());
        itemDTO.setItemName(item.getItemName());
        itemDTO.setProfitMargin(item.getProfitMargin());
        itemDTO.setExpectedProfit(item.getExpectedProfit());
        itemDTO.setGender(item.getShoeGender());

        if (!item.getSuppliers().isEmpty()) {
            itemDTO.setSupplierName(item.getSuppliers().get(0).getSupplierName());
        }
        if (!item.getTypes().isEmpty()) {
            itemDTO.setTypeName(item.getTypes().get(0).getTypeName());
        }
        if (!item.getCategories().isEmpty()) {
            itemDTO.setCategoryName(item.getCategories().get(0).getCategoryName());
        }

        List<ItemColourDTO> itemColourDTOS = new ArrayList<>();
        for (Colour colour : item.getColours()) {
            ItemColourDTO itemColourDTO = new ItemColourDTO();
            itemColourDTO.setColourName(colour.getColourName());

            ItemColour itemColour = itemColourRepository.findByItemItemCodeAndColourColourCode(item.getItemCode(), colour.getColourCode());
            itemColourDTO.setImage(itemColour.getImgPath());
            itemColourDTO.setSellPrice(itemColour.getSellPrice());
            itemColourDTO.setBuyPrice(itemColour.getBuyPrice());

            List<ItemSizeDTO> itemSizeDTOS = new ArrayList<>();

            List<ItemDetails> itemDetailsList = itemDetailsRepository.findByItem_ItemCodeAndColour_ColourCode(item.getItemCode(), colour.getColourCode());
            for (ItemDetails itemDetails : itemDetailsList) {
                Size size = itemDetails.getSize();
                ItemSizeDTO itemSizeDTO = new ItemSizeDTO();

                itemSizeDTO.setQuantity(itemDetails.getQty());
                itemSizeDTO.setSize(size.getSize());

                itemSizeDTOS.add(itemSizeDTO);
            }
            itemColourDTO.setSizes(itemSizeDTOS);
            itemColourDTOS.add(itemColourDTO);
        }
        itemDTO.setColours(itemColourDTOS);
        return itemDTO;
    }
}
