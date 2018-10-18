#version 330

layout(location = 0) in vec4 vertexPosition;
uniform float inputTime;
void main()
{
    vec4 modifiedVertexPosition = vertexPosition;

    // Insert your code for "Slightly-More Advanced Shaders" here.

    if(sin(inputTime) > 0){
    	modifiedVertexPosition.y = modifiedVertexPosition.y - sin(inputTime);
    }
    else{
    	modifiedVertexPosition.y = modifiedVertexPosition.y + sin(inputTime);
    }

    gl_Position = modifiedVertexPosition;






    gl_Position = modifiedVertexPosition;
}
