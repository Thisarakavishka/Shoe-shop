package com.helloshoes.shoeshopmanagement.dto;

import com.helloshoes.shoeshopmanagement.entity.enums.ShoeGender;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemDTO implements SuperDTO{
    private String itemCode;
    private String itemName;
    private String categoryName;
    private String supplierName;
    private String typeName;
    private ShoeGender gender;
    private Double profitMargin;
    private Double expectedProfit;
    private List<ItemColourDTO> colours;
}
