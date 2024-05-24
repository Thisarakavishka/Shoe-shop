package com.helloshoes.shoeshopmanagement.service.impl;

import com.helloshoes.shoeshopmanagement.dto.*;
import com.helloshoes.shoeshopmanagement.entity.*;
import com.helloshoes.shoeshopmanagement.repository.*;
import com.helloshoes.shoeshopmanagement.service.SalesService;
import com.helloshoes.shoeshopmanagement.util.DataConvertor;
import com.helloshoes.shoeshopmanagement.util.IDGeneratorUtil;
import com.helloshoes.shoeshopmanagement.util.IdType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class SalesServiceImpl implements SalesService {

    private final SalesRepository salesRepository;
    private final EmployeeRepository employeeRepository;
    private final CustomerRepository customerRepository;
    private final ItemRepository itemRepository;
    private final ColourRepository colourRepository;
    private final SizeRepository sizeRepository;
    private final SaleItemRepository saleItemRepository;
    private final ItemColourRepository itemColourRepository;
    private final ItemSizeRepository itemSizeRepository;
    private final ItemDetailsRepository itemDetailsRepository;
    private final DataConvertor dataConvertor;

    @Override
    public SaleDTO save(SaleDTO dto) {
        Sales sale = new Sales();
        sale.setSaleCode(dto.getSaleCode());
        sale.setTotalPrice(dto.getTotalPrice());
        sale.setPaymentMethod(dto.getPaymentMethod());
        sale.setAddedPoints(dto.getAddedPoints());
        sale.setDate(dto.getDate());

        Employee employee = employeeRepository.findById(dto.getEmployeeCode())
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        sale.setEmployee(employee);

        Customer customer = customerRepository.findById(dto.getCustomerCode())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        sale.setCustomer(customer);

        Sales savedSale = salesRepository.save(sale);

        List<Item> itemList = new ArrayList<>();
        for (ItemDTO itemDTO : dto.getItems()) {
            Optional<Item> itemOptional = itemRepository.findById(itemDTO.getItemCode());
            if (itemOptional.isPresent()) {
                Item item = itemOptional.get();

                SaleItem saleItem = new SaleItem();
                saleItem.setId(IDGeneratorUtil.idGenerator(IdType.SALE_ITEM));
                saleItem.setSale(savedSale);

                saleItem.setItem(item);
                saleItem.setQty(itemDTO.getColours().get(0).getSizes().get(0).getQuantity());

                Colour colour = colourRepository.findByName(itemDTO.getColours().get(0).getColourName());
                saleItem.setColour(colour);

                Size size = sizeRepository.findBySize(itemDTO.getColours().get(0).getSizes().get(0).getSize());
                saleItem.setSize(size);

                saleItemRepository.save(saleItem);

                itemList.add(item);
            }
        }

        savedSale.setItems(itemList);
        Sales sales = salesRepository.save(savedSale);
        return convertToDTO(sales);
    }

    private SaleDTO convertToDTO(Sales sales) {
        SaleDTO dto = new SaleDTO();
        dto.setSaleCode(sales.getSaleCode());
        dto.setTotalPrice(sales.getTotalPrice());
        dto.setPaymentMethod(sales.getPaymentMethod());
        dto.setAddedPoints(sales.getAddedPoints());
        dto.setDate(sales.getDate());

        if (sales.getEmployee() != null) {
            dto.setEmployeeCode(sales.getEmployee().getEmployeeCode());
        }

        if (sales.getCustomer() != null) {
            dto.setCustomerCode(sales.getCustomer().getCustomerCode());
        }

        List<SaleItem> saleItems = saleItemRepository.findBySaleCode(sales.getSaleCode());
        System.out.println(saleItems.stream().count());

        List<ItemDTO> itemDTOList = new ArrayList<>();
        for (SaleItem saleItem : saleItems) {

            ItemDTO itemDTO = new ItemDTO();
            itemDTO.setItemCode(saleItem.getItem().getItemCode());

            ItemColourDTO colourDTO = new ItemColourDTO();
            colourDTO.setColourName(saleItem.getColour().getColourName());

            ItemSizeDTO itemSizeDTO = new ItemSizeDTO();
            itemSizeDTO.setSize(saleItem.getSize().getSize());
            itemSizeDTO.setQuantity(saleItem.getQty());

            List<ItemSizeDTO> sizes = new ArrayList<>();
            sizes.add(itemSizeDTO);
            colourDTO.setSizes(sizes);

            List<ItemColourDTO> colours = new ArrayList<>();
            colours.add(colourDTO);
            itemDTO.setColours(colours);
            itemDTOList.add(itemDTO);
        }
        dto.setItems(itemDTOList);
        return dto;
    }

    @Override
    public List<SaleDTO> getAll() {
        List<Sales> salesList = salesRepository.findAll();
        List<SaleDTO> saleDTOList = new ArrayList<>();
        for (Sales sales : salesList) {
            saleDTOList.add(convertToDTO(sales));
        }
        return saleDTOList;
    }

    @Override
    public SaleDTO getByCode(String code) {
        if (!salesRepository.existsById(code)) {
            return null;
        }
        Sales sales = salesRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Sale not found"));
        return convertToDTO(sales);
    }

    @Override
    public Boolean delete(String code) {
        return null;
    }

    @Override
    public Boolean update(String code, SaleDTO dto) {
    /*
        Sales existingSale = salesRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Sale not found"));

        existingSale.setTotalPrice(dto.getTotalPrice());
        existingSale.setPaymentMethod(dto.getPaymentMethod());
        existingSale.setAddedPoints(dto.getAddedPoints());
        existingSale.setDate(dto.getDate());

        Employee employee = employeeRepository.findById(dto.getEmployeeCode())
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        existingSale.setEmployee(employee);

        Customer customer = customerRepository.findById(dto.getCustomerCode())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        existingSale.setCustomer(customer);

        // Update items
        List<Item> existingItems = existingSale.getItems();
        saleItemRepository.deleteAll(existingItems);
        List<Item> newItemList = new ArrayList<>();
        for (ItemDTO itemDTO : dto.getItems()) {
            Optional<Item> itemOptional = itemRepository.findById(itemDTO.getItemCode());
            if (itemOptional.isPresent()) {
                Item item = itemOptional.get();

                SaleItem saleItem = new SaleItem();
                saleItem.setId(IDGeneratorUtil.idGenerator(IdType.SALE_ITEM));
                saleItem.setSale(existingSale);

                saleItem.setItem(item);
                saleItem.setQty(itemDTO.getColours().get(0).getSizes().get(0).getQuantity());

                Colour colour = colourRepository.findByName(itemDTO.getColours().get(0).getColourName());
                saleItem.setColour(colour);

                Size size = sizeRepository.findBySize(itemDTO.getColours().get(0).getSizes().get(0).getSize());
                saleItem.setSize(size);

                saleItemRepository.save(saleItem);

                newItemList.add(item);
            }
        }

        existingSale.setItems(newItemList);
        salesRepository.save(existingSale);

     */
        return true;
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
