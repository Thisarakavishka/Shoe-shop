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
public class CategoryDTO implements SuperDTO {

    @NotBlank(message = "Category code is Required")
    @Pattern(regexp = RegexUtil.CATEGORY_REGEX, message = "Invalid Category Code")
    private String categoryCode;

    @NotBlank(message = "Category Name code is Required")
    @Size(min = 3, max = 20, message = "Category Character code must be between 3 and 20 characters")
    private String categoryName;

    @NotBlank(message = "Category Character code is Required")
    @Size(min = 1, max = 2, message = "Category Character code must be between 1 and 2 characters")
    private String categoryCharacter;
}
