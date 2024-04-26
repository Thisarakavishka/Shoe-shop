package com.helloshoes.shoeshopmanagement.dto;

import com.helloshoes.shoeshopmanagement.util.RegexUtil;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SizeDTO {

    @NotBlank(message = "Size code is Required")
    @Pattern(regexp = RegexUtil.SIZE_REGEX, message = "Invalid Size Code")
    private String sizeCode;

    @NotNull(message = "Size is Required")
    private Integer size;
}
