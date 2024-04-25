package com.helloshoes.shoeshopmanagement.dto;

import com.helloshoes.shoeshopmanagement.entity.enums.Category;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplierDTO implements SuperDTO {

    @NotBlank(message = "Supplier code is Required")
    private String supplierCode;

    @NotBlank(message = "Supplier name is Required")
    private String supplierName;

    @NotNull(message = "Category is Required")
    private Category category;

    @NotBlank(message = "Address No is Required")
    private String addressNo;

    @NotBlank(message = "Address Lane is Required")
    private String addressLane;

    @NotBlank(message = "City is Required")
    private String addressCity;

    @NotBlank(message = "State is Required")
    private String addressState;

    @NotBlank(message = "Postal Code is Required")
    @Pattern(regexp = "\\d{5}", message = "Postal Code must be 5 digits")
    private String postalCode;

    @NotBlank(message = "Country is Required")
    private String country;

    @NotBlank(message = "Mobile Contact Number is Required")
    @Pattern(regexp = "\\d{10}", message = "Mobile Contact Number must be 10 digits")
    private String contactMobile;

    @NotBlank(message = "Landline Number is Required")
    @Pattern(regexp = "\\d{10}", message = "Landline Number must be 10 digits")
    private String contactLandline;

    @NotBlank(message = "Email is Required")
    @Email(message = "Email should be valid")
    private String email;
}
