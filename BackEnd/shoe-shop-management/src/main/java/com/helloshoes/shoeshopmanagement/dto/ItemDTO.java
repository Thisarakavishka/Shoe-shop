package com.helloshoes.shoeshopmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemDTO implements SuperDTO{
    private String itemName;
    private String category;
    private String supplier;
    private String type;
    private String gender;
    private Double profitMargin;
    private Double expectedProfit;
    private List<ItemColourDTO> colours;
}
