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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

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

        Supplier supplier = supplierRepository.getReferenceById(dto.getSupplierName());
        List<Supplier> supplierList = new ArrayList<>();
        supplierList.add(supplier);
        item.setSuppliers(supplierList);

        Category category = categoryRepository.getReferenceById(dto.getCategoryName());
        List<Category> categoryList = new ArrayList<>();
        categoryList.add(category);
        item.setCategories(categoryList);

        Type type = typeRepository.getReferenceById(dto.getTypeName());
        List<Type> typeList = new ArrayList<>();
        typeList.add(type);
        item.setTypes(typeList);

        itemRepository.save(item);

        for (ItemColourDTO itemColourDTO : dto.getColours()) {
            Colour colour = colourRepository.getReferenceById(itemColourDTO.getColourName());
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
                itemSizeRepository.save(itemSize);

                ItemDetails itemDetails = new ItemDetails();
                itemDetails.setId(IDGeneratorUtil.idGenerator(IdType.ITEM_DETAILS));
                itemDetails.setItem(item);
                itemDetails.setColour(colour);
                itemDetails.setType(type);
                itemDetails.setCategory(category);
                itemDetails.setSize(size);
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
        return null;
    }

    @Override
    public List<ItemDTO> getAll() {
        return null;
    }

    @Override
    public Boolean update(String code, ItemDTO dto) {
        return null;
    }
}
