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

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

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
    private final RefundRepository refundRepository;

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

            Optional<Item> item = itemRepository.findById(saleItem.getItem().getItemCode());
            ItemDTO itemDTO = new ItemDTO();
            if (item.isPresent()) {
                Item existingItem = item.get();
                itemDTO.setItemCode(existingItem.getItemCode());
                itemDTO.setItemName(existingItem.getItemName());
                itemDTO.setCategoryName(String.valueOf(existingItem.getCategories().get(0).getCategoryName()));
                itemDTO.setTypeName(String.valueOf(existingItem.getTypes().get(0).getTypeName()));
                itemDTO.setSupplierName(String.valueOf(existingItem.getSuppliers().get(0).getSupplierName()));
                itemDTO.setGender(item.get().getShoeGender());
                itemDTO.setExpectedProfit(existingItem.getExpectedProfit());
                itemDTO.setProfitMargin(existingItem.getProfitMargin());

                Colour colour = colourRepository.findByName(saleItem.getColour().getColourName());
                Optional<ItemColour> itemColour = itemColourRepository.findByItemAndColour(existingItem, colour);

                ItemColourDTO colourDTO = new ItemColourDTO();
                if (itemColour.isPresent()) {
                    colourDTO.setColourName(colour.getColourName());
                    colourDTO.setImage(itemColour.get().getImgPath());
                    colourDTO.setSellPrice(itemColour.get().getSellPrice());
                    colourDTO.setBuyPrice(itemColour.get().getBuyPrice());
                }

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
    public Boolean update(String code, SaleDTO dto) {
        return null;
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
    public Boolean update(String code, RefundDTO dto) {
        if (!dto.getSaleCode().equals(code)) {
            return false;
        }
        Sales existingSale = salesRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Sale not found with code: " + code));

        Map<String, Map<String, Map<String, Integer>>> itemColourSizeMap = new HashMap<>();

        for (ItemDTO itemDTO : dto.getItems()) {
            Optional<Item> itemOptional = itemRepository.findById(itemDTO.getItemCode());
            Item existItem = itemOptional
                    .orElseThrow(() -> new RuntimeException("Item not found with code: " + itemDTO.getItemCode()));

            Colour colour = colourRepository.findByName(itemDTO.getColours().get(0).getColourName());
            Size size = sizeRepository.findBySize(itemDTO.getColours().get(0).getSizes().get(0).getSize());

            if (colour == null) {
                throw new RuntimeException("Colour not found with name: " + itemDTO.getColours().get(0).getColourName());
            }
            if (size == null) {
                throw new RuntimeException("Size not found with value: " + itemDTO.getColours().get(0).getSizes().get(0).getSize());
            }

            int quantity = itemDTO.getColours().get(0).getSizes().get(0).getQuantity();

            itemColourSizeMap.putIfAbsent(existItem.getItemCode(), new HashMap<>());
            itemColourSizeMap.get(existItem.getItemCode()).putIfAbsent(colour.getColourCode(), new HashMap<>());
            itemColourSizeMap.get(existItem.getItemCode()).get(colour.getColourCode()).put(size.getSizeCode(), quantity);
        }

        for (Map.Entry<String, Map<String, Map<String, Integer>>> itemEntry : itemColourSizeMap.entrySet()) {
            String itemCode = itemEntry.getKey();
            for (Map.Entry<String, Map<String, Integer>> colourEntry : itemEntry.getValue().entrySet()) {
                String colourCode = colourEntry.getKey();
                for (Map.Entry<String, Integer> sizeEntry : colourEntry.getValue().entrySet()) {
                    String sizeCode = sizeEntry.getKey();
                    int quantity = sizeEntry.getValue();

                    int delete = saleItemRepository.deleteBySaleAndItemAndSizeAndColour(
                            dto.getSaleCode(),
                            itemCode,
                            sizeCode,
                            colourCode
                    );

                    if (delete == 0) {
                        throw new RuntimeException("Failed to delete SaleItem with saleCode: " + dto.getSaleCode()
                                + ", itemCode: " + itemCode
                                + ", sizeCode: " + sizeCode
                                + ", colourCode: " + colourCode);
                    }

                    Optional<ItemSize> itemSizeOptional = itemSizeRepository.findByItemCodeAndColourCodeAndSizeCode(itemCode, colourCode, sizeCode);
                    if (itemSizeOptional.isPresent()) {
                        ItemSize itemSize = itemSizeOptional.get();
                        itemSize.setQty(itemSize.getQty() + quantity);
                        System.out.println(quantity);
                        itemSizeRepository.save(itemSize);
                    } else {
                        throw new RuntimeException("ItemSize not found for itemCode: " + itemCode
                                + ", colourCode: " + colourCode
                                + ", sizeCode: " + sizeCode);
                    }
                }
            }
        }

        BigDecimal totalPrice = BigDecimal.valueOf(existingSale.getTotalPrice())
                .subtract(BigDecimal.valueOf(dto.getTotalRefund()));
        existingSale.setTotalPrice(totalPrice.setScale(2, RoundingMode.HALF_UP).doubleValue());

        existingSale.setAddedPoints(existingSale.getAddedPoints() - dto.getAddedPoints());

        Refund refund = new Refund();
        refund.setRefundCode(IDGeneratorUtil.idGenerator(IdType.REFUND));
        refund.setDescription(dto.getRefundDescription());
        refund.setDate(dto.getDate());

        Employee employee = employeeRepository.findById(dto.getEmployeeCode())
                .orElseThrow(() -> new RuntimeException("Employee not found with code: " + dto.getEmployeeCode()));
        refund.setEmployee(employee);

        refund.setItems(new ArrayList<>(itemRepository.findAllById(itemColourSizeMap.keySet())));

        refundRepository.save(refund);

        return true;
    }

    @Override
    public String getNextSaleCode() {
        String nextCode = salesRepository.findNextSaleCode();
        if (nextCode == null) {
            return "SC001";
        }
        int code = Integer.parseInt(nextCode.substring(3)) + 1;
        return "SC" + String.format("%03d", code);
    }

    public List<SaleDTO> getSalesWithinDateRange(Date startDate, Date endDate) {
        List<Sales> sales = salesRepository.findSalesWithinDateRange(startDate, endDate);
        List<SaleDTO> saleDTOList = new ArrayList<>();
        for (Sales sale : sales) {
            saleDTOList.add(convertToDTO(sale));
        }
        return saleDTOList;
    }
}