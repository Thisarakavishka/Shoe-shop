package com.helloshoes.shoeshopmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemColourDTO implements SuperDTO{
    private String colourName;
    private String hexValue;
    private String image;
    private List<ItemSizeDTO> sizes;
}
