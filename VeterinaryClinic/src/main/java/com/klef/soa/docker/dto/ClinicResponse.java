package com.klef.soa.docker.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClinicResponse {
	private long id;
	private String name;
	private String addreess;
	private String phone;
	private boolean emergencyService;

}
