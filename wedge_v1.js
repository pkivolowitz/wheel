class WedgeV1
{
	constructor()
	{
		this.vrts = [];
		this.vrts_buffer = null;
	}

	Radians(angle_in_degrees) 
	{
		return angle_in_degrees * (Math.PI / 180);
	}

	Initialize(wedge_count, steps)
	{
		var p = vec3.fromValues(1, 0, 0);
		var z = vec3.fromValues(0, 0, 1);
		var v = vec3.create();
		var sweep = this.Radians(360) / wedge_count;
		var step = sweep / steps;
		var m = mat4.create();
		var counter = 0;
		
		this.vrts_buffer = gl.createBuffer();
		this.PushVertex(this.vrts, vec3.fromValues(0, 0, 0));
		for (counter = 0; counter <= steps; counter++) {
			vec3.transformMat4(v, p, m);
			this.PushVertex(this.vrts, v);
			mat4.rotate(m, m, step, z);
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vrts_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vrts), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		this.InitializeShader();				
	}

	PushVertex(a, v)
	{
		a.push(v[0], v[1], v[2]);
	}

	InitializeShader()
	{
		this.p_shader = CreateShader("solid-vertex_shader", "solid-fragment_shader");
		gl.useProgram(this.p_shader);
		this.p_coordinates = gl.getAttribLocation(this.p_shader, "vertex_coordinates");
		this.p_modelview_matrix_handle = gl.getUniformLocation(this.p_shader, "modelview_matrix");
		this.p_projection_matrix_handle = gl.getUniformLocation(this.p_shader, "projection_matrix");
		this.p_solid_color = gl.getUniformLocation(this.p_shader, "solid_color");
		gl.useProgram(null);
	}

	Draw(modelview_matrix, projection_matrix, primary_color)
	{
		primary_color = primary_color || vec4.fromValues(1, 1, 1, 1);
		gl.useProgram(this.p_shader);
		gl.uniformMatrix4fv(this.p_projection_matrix_handle, false, projection_matrix);
		gl.uniformMatrix4fv(this.p_modelview_matrix_handle, false, modelview_matrix);		
		if (this.p_solid_color != null) {
			gl.uniform4fv(this.p_solid_color, primary_color)
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vrts_buffer);
		gl.vertexAttribPointer(this.p_coordinates, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.p_coordinates);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vrts.length / 3);
		gl.disableVertexAttribArray(this.p_coordinates);
		gl.useProgram(null);
	}
}

