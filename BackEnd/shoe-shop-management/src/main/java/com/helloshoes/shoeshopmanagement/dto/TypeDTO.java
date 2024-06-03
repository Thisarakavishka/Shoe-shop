package com.helloshoes.shoeshopmanagement.dto;

import com.helloshoes.shoeshopmanagement.util.RegexUtil;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TypeDTO implements SuperDTO {

    @NotBlank(message = "Type code is Required")
    @Pattern(regexp = RegexUtil.TYPE_REGEX, message = "Invalid Type Code")
    private String typeCode;

    @NotBlank(message = "Type Name is Required")
    @Size(min = 3, max = 30, message = "Type Character code must be between 3 and 20 characters")
    private String typeName;

    @NotBlank(message = "Type Character is Required")
    @Size(min = 2, max = 2, message = "Type Character must be 2 characters")
    private String typeCharacter;
}
