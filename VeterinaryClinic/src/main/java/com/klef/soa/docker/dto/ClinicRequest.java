package com.klef.soa.docker.dto;

import lombok.Data;

@Data
public class ClinicRequest {
	private String name;
	private String addreess;
	private String phone;
	private boolean emergencyService;

}
