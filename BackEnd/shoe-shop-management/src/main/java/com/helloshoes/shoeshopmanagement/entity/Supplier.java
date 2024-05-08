package com.helloshoes.shoeshopmanagement.entity;

import com.helloshoes.shoeshopmanagement.entity.enums.Category;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "supplier")
public class Supplier implements SuperEntity {
    @Id
    private String supplierCode;
    private String supplierName;
    @Enumerated(EnumType.STRING)
    private Category category;
    private String addressNo;
    private String addressLane;
    private String addressCity;
    private String addressState;
    private String postalCode;
    private String country;
    private String contactMobile;
    private String contactLandline;
    private String email;

    @ManyToMany(mappedBy = "suppliers", cascade = CascadeType.ALL)
    private List<Item> items;
}
