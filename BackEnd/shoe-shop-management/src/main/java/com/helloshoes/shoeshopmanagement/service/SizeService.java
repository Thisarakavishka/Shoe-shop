package com.helloshoes.shoeshopmanagement.service;

import com.helloshoes.shoeshopmanagement.dto.SizeDTO;

public interface SizeService extends SuperService<SizeDTO> {
    SizeDTO getSizeBySize(int size);
}
