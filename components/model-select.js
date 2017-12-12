export default (options, config = {}) => {
	return {
		render() {
			return (
				<el-select
					value={this.value}
					onChange={val => {
						this.$emit('input', val);
					}}
					size="mini"
					{...config}
					placeholder="类型"
					class="select"
				>
					{options.map(item => {
						return (
							<el-option
								key={item.value}
								label={item.label}
								value={item.value}
							/>
						);
					})}
				</el-select>
			);
		},
		props: ['value']
	};
};
