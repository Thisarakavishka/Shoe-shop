package com.helloshoes.shoeshopmanagement.dto;

import com.helloshoes.shoeshopmanagement.entity.enums.Gender;
import com.helloshoes.shoeshopmanagement.entity.enums.Role;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDTO implements SuperDTO {

    @NotBlank(message = "Employee code is Required")
    private String employeeCode;

    @NotBlank(message = "Employee name is Required")
    @Size(min = 3, max = 30, message = "Employee name must be between 3 and 30 characters")
    private String employeeName;

    @NotBlank(message = "Employee Profile Picture is Required")
    private String profilePic;

    @NotNull(message = "Gender is Required")
    private Gender gender;

    @NotBlank(message = "Status is Required")
    private String status;

    @NotBlank(message = "Designation is Required")
    private String designation;

    @NotNull(message = "Role is Required")
    private Role role;

    @NotNull(message = "Date Of Birth is Required")
    @Past(message = "Date Of Birth must be past")
    private Date dob;

    @NotNull(message = "Joined Date is Required")
    @PastOrPresent(message = "Joined Date must be past or present")
    private Date joinedDate;

    @NotBlank(message = "Branch is Required")
    private String branch;

    @NotBlank(message = "AddressNo is Required")
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

    @NotBlank(message = "Contact Number is Required")
    @Pattern(regexp = "\\d{10}", message = "Contact Number must be 10 digits")
    private String contactNumber;

    @NotBlank(message = "Email is Required")
    @Email(message = "Email should be valid")
    private String email;

    @NotNull(message = "Password is Required")
    private String password;

    @NotBlank(message = "Emergency Contact Person is Required")
    private String emergencyContactPerson;

    @NotBlank(message = "Emergency Contact Number is Required")
    @Pattern(regexp = "\\d{10}", message = "Emergency Contact Number must be 10 digits")
    private String emergencyContactNumber;
}
