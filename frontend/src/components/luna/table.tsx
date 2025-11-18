{/* 
<A.TanStackTable class="flex-1 h-0 flex-col text-[#706F79] w-0">
	<table class="table-fixed w-full h-full border-collapse">
		<thead class="sticky top-0 [box-shadow:0_0.5px_0_0_#D7D7D7] border-x border-[#D7D7D7] w-max [background-image:linear-gradient(#F5F5F5,#ECECEC)]">
			<For each={libraryTable.getHeaderGroups()}>
				{headerGroup => (
					<For each={headerGroup.headers}>
						{header => (
							!header.column.getIsPinned() &&
							<th
								style={{ "width": `${header.getSize()}px` }}
								class="text-left font-normal relative w-[var(--width)]"
								onClick={() => {
									const info = header.column.columnDef.meta as any as { group?: { sorting: any[] } }
									if (!info.group) return
									const keyCol = info.group.sorting[0]

									libraryTableState.columnPinning.left = (
										libraryTableState.sorting.length && libraryTableState.sorting[0].desc == true
											? []
											: [keyCol]
									)

									libraryTableState.sorting = (
										!libraryTableState.sorting.length || libraryTableState.sorting[0].id != keyCol
											? info.group.sorting.map(x => ({ id: x, desc: false })) :
											libraryTableState.sorting[0].desc == false
												? info.group.sorting.map(x => ({ id: x, desc: true })) :
												[]
									)
								}}
							>
								{flexRender(header.column.columnDef.header, header.getContext())}
								<A.ColumnResizeIndicator
									class="bg-[#C1C2C8] w-px h-full absolute right-0 top-0"
									style={{
										transform: header.column.getIsResizing()
											? `translateX(${libraryTable.getState().columnSizingInfo.deltaOffset}px)`
											: '',
									}}
								/>
								<A.ColumnResizeHandle
									onMouseDown={header.getResizeHandler()}
									onTouchStart={header.getResizeHandler()}
									class="cursor-col-resize w-1 h-full absolute right-0 top-0"
								/>
							</th>
						)}
					</For>
				)}
			</For>
		</thead>
		<tbody>
			<For each={rowModel()}>
				{(row, index) => {
					const isPinned = createMemo(() => {
						const [pinned] = row.getLeftVisibleCells()
						if (!pinned || !pinned.column.getIsPinned() || !pinned.column.getIsSorted()) return
						if (pinned.getValue() == rowModel()[index() - 1]?.getVisibleCells()[0].getValue()) return
						return (
							<tr>
								<td colspan={row.getVisibleCells().length}>
									<A.ArtistLine class="text-black">
										<A.ArtistTitle class="pl-2 pr-1 font-semibold text-nowrap">
											{flexRender(pinned.column.columnDef.cell, pinned.getContext())}
										</A.ArtistTitle>
										<A.Decoration class="flex-1 items-center h-full pr-2 mb-1.5">
											<A.Line class="h-px w-80 bg-[linear-gradient(90deg,#5895F7,#FEFEFF)]" />
										</A.Decoration>
									</A.ArtistLine>
								</td>

							</tr>
						)
					})
					return (
						<>
							{isPinned()}
							<tr class="hover:bg-[#DADADA] aria-selected:bg-[#4069BF] border border-dotted border-transparent aria-selected:text-white aria-selected:border-[#C5974B] data-[current='true']:text-[#3D6FE1]">
								<For each={row.getVisibleCells()}>
									{(cell) => (
										<>
											{!cell.column.getIsPinned() &&
												<td data-highlight={(cell.column.columnDef.meta as any).highlight} class="data-[highlight=true]:text-black text-nowrap overflow-hidden text-ellipsis">
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</td>
											}
										</>
									)}
								</For>
							</tr>
						</>
					)
				}}
			</For>
		</tbody>
	</table>
</A.TanStackTable> 
*/}