package com.helloshoes.shoeshopmanagement.service;

import com.helloshoes.shoeshopmanagement.dto.ColourDTO;

public interface ColourService extends SuperService<ColourDTO> {
    ColourDTO getColourByName(String colourName);

    String getNextColourCode();
}
