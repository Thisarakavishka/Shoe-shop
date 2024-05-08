package com.helloshoes.shoeshopmanagement.entity;

import com.helloshoes.shoeshopmanagement.entity.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sales")
public class Sales implements SuperEntity{
    @Id
    private String saleCode;
    private Double totalPrice;
    private PaymentMethod paymentMethod;
    private Integer addedPoints;
    private Date date;

    @ManyToOne
    @JoinColumn(name = "employee_code")
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "customer_code")
    private Customer customer;

    @ManyToMany(mappedBy = "sales",cascade = CascadeType.ALL)
    private List<Item> items;
}
