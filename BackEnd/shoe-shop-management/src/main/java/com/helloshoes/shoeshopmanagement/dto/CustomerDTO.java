package com.helloshoes.shoeshopmanagement.dto;

import com.helloshoes.shoeshopmanagement.entity.enums.CustomerLevel;
import com.helloshoes.shoeshopmanagement.entity.enums.Gender;
import com.helloshoes.shoeshopmanagement.util.RegexUtil;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDTO {

    @NotBlank(message = "Customer code is Required")
    @Pattern(regexp = RegexUtil.CUSTOMER_REGEX, message = "Customer Code is Invalid")
    private String customerCode;

    @NotBlank(message = "Customer name is Required")
    @Size(min = 3, max = 30, message = "Customer name must be between 3 and 30 characters")
    private String customerName;

    @NotNull(message = "Gender is Required")
    private Gender gender;

    @NotNull(message = "Joined Date is Required")
    @PastOrPresent(message = "Joined Date must be past or present")
    private Date joinedDate;

    @NotNull(message = "Customer Level is Required")
    private CustomerLevel customerLevel;

    @NotNull(message = "Total Points is Required")
    @Min(value = 0, message = "Total Points must be a positive number")
    private Integer totalPoints;

    @NotNull(message = "Date Of Birth is Required")
    @Past(message = "Date Of Birth must be past")
    private Date dob;

    @NotBlank(message = "Address No is Required")
    private String addressNo;

    @NotBlank(message = "Address No is Required")
    private String addressLane;

    @NotBlank(message = "Address No is Required")
    private String addressCity;

    @NotBlank(message = "Address No is Required")
    private String addressState;

    @NotBlank(message = "Postal Code is Required")
    @Pattern(regexp = RegexUtil.POSTAL_CODE_REGEX, message = "Postal Code must be 5 digits")
    private String postalCode;

    @NotBlank(message = "Contact Number is Required")
    @Pattern(regexp = RegexUtil.PHONE_NUMBER_REGEX, message = "Contact Number must be 10 digits")
    private String contactNumber;

    @NotBlank(message = "Email is Required")
    @Email(message = "Email should be valid")
    private String email;

    @NotNull(message = "Recent Purchase Date Time is Required")
    private Timestamp recentPurchaseDateTime;
}
