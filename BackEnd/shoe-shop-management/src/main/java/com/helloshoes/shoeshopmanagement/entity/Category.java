package com.helloshoes.shoeshopmanagement.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "category")
public class Category implements SuperEntity {
    @Id
    private String categoryCode;
    private String categoryName;
    private String categoryCharacter;
}
